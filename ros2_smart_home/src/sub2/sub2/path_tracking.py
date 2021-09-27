import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, Point, Point32
from ssafy_msgs.msg import TurtlebotStatus
from squaternion import Quaternion
from nav_msgs.msg import Odometry,Path
from math import pi,cos,sin,sqrt,atan2
import numpy as np
from sensor_msgs.msg import LaserScan, PointCloud
from std_msgs.msg import String
import time
# path_tracking 노드는 로봇의 위치(/odom), 로봇의 속도(/turtlebot_status), 주행 경로(/local_path)를 받아서, 주어진 경로를 따라가게 하는 제어 입력값(/cmd_vel)을 계산합니다.
# 제어입력값은 선속도와 각속도로 두가지를 구합니다. 


# 노드 로직 순서
# 1. 제어 주기 및 타이머 설정
# 2. 파라미터 설정
# 3. Quaternion 을 euler angle 로 변환
# 4. 터틀봇이 주어진 경로점과 떨어진 거리(lateral_error)와 터틀봇의 선속도를 이용해 전방주시거리 계산
# 5. 전방 주시 포인트 설정
# 6. 전방 주시 포인트와 로봇 헤딩과의 각도 계산
# 7. 선속도, 각속도 정하기

class followTheCarrot(Node):
    def __init__(self):
        super().__init__('path_tracking')

        # 로봇을 움직이게 하는 부분
        self.cmd_pub = self.create_publisher(Twist, 'cmd_vel', 10)

        # 장애물 확인
        self.obs_pub = self.create_publisher(String, 'obs_msg', 1)

        # 로봇의 현재 위치
        self.subscription = self.create_subscription(Odometry,'/odom',self.odom_callback,10)
        self.status_sub = self.create_subscription(TurtlebotStatus,'/turtlebot_status',self.status_callback,10)
 
        # 경로 받아오기
        self.path_sub = self.create_subscription(Path,'/local_path',self.path_callback,10)
  
        # 라이다 데이터 구독
        self.lidar_sub = self.create_subscription(LaserScan, '/scan', self.lidar_callback, 10)

        # 로직 1. 제어 주기 및 타이머 설정
        time_period=0.05
        self.timer = self.create_timer(time_period, self.timer_callback)

        self.is_odom = False
        self.is_path = False
        self.path_exists = False
        self.is_status = False
        self.collision_forward = False
        self.collision_backward = False
        self.forward_obs = False
        self.backward_obs = False

        self.odom_msg=Odometry()            
        self.robot_yaw=0.0
        self.turtle_yaw = 0.0
        self.path_msg=Path()
        self.cmd_msg=Twist()

        # 로직 2. 파라미터 설정(전방주시거리)
        self.lfd=0.1
        self.min_lfd=0.1
        self.max_lfd=1.0

        # 터틀봇이 정지해있는지 판단
        self.stop_cnt = 0 # 터틀봇이 멈춰 있는지 판단하는 간격을 정하기 위한 변수
        self.is_stop = True # 터틀봇의 정지 여부 판단
        self.out_vel = 0.0 # 탈출을 계속하기 위해 필요함
        self.out_rad_vel = 0.0

        self.cnt = 0
        self.turn_right = False

        self.state = 1
        self.go_forward = 0
        self.go_backward = 0

    def timer_callback(self):
        # # 1. 경로가 남아있음에도 터틀봇이 정지해있는 경우
        # if self.is_status and self.is_odom and self.path_exists and self.is_stop:
        #     self.out_vel = -0.3
        #     self.out_rad_vel = 0.2
        #     self.stop_cnt -= 1
        #     self.cmd_msg.linear.x = self.out_vel
        #     self.cmd_msg.angular.z = self.out_rad_vel

        #     if self.stop_cnt == 270:
        #         self.stop_cnt = 0
        #         self.out_rad_vel = 0.0
        #         self.is_stop = False

        # # 2. 터틀봇이 잘못된 위치에 있어 정지한 경우(경로가 만들어지지 않음)
        # if self.is_status and self.is_odom and not self.path_exists and self.is_stop:
        #     # 전방에 장애물이 없는 곳으로 회전한다.
        #     if self.forward_obs == True or self.backward_obs:
        #         self.cmd_msg.angular.z = 0.0
        #         self.cmd_msg.linear.x = -0.3
        #         for i in range(10):
        #             self.cmd_pub.publish(self.cmd_msg)
        #             print("pub back")
        #             time.sleep(0.05)
        #         self.cmd_msg.angular.z = 0.3
        #         self.cmd_msg.linear.x = 0.0
        #         for i in range(10):
        #             self.cmd_pub.publish(self.cmd_msg)
        #             print("pub rot")
        #             time.sleep(0.05)
        #         # 회전이 끝나면 직진
        #         self.cmd_msg.angular.z = 0.0
        #         self.cmd_msg.linear.x = 0.2
        #         for i in range(10):
        #             self.cmd_pub.publish(self.cmd_msg)
        #             print("pub forward")
        #             time.sleep(0.05)
        #     else:
        #         pass

        # 1. turtlebot이 연결되어 있고, odom이 작동하며, 경로가 있을 때,
        if self.is_status and self.is_odom and self.is_path:
            # 남은 경로가 1 이상이면
            if len(self.path_msg.poses)> 1:
                self.is_look_forward_point = False
                
                # 로봇의 현재 위치를 나타내는 변수
                robot_pose_x = self.odom_msg.pose.pose.position.x
                robot_pose_y = self.odom_msg.pose.pose.position.y

                # 로봇과 가장 가까운 경로점과의 직선거리
                lateral_error = sqrt(pow(self.path_msg.poses[0].pose.position.x-robot_pose_x,2)+pow(self.path_msg.poses[0].pose.position.y-robot_pose_y,2))
                # print(robot_pose_x,robot_pose_y,lateral_error)

                # 로직 4. 로봇이 주어진 경로점과 떨어진 거리(lateral_error)와 로봇의 선속도를 이용해 전방주시거리 설정
                
                self.lfd = (self.status_msg.twist.linear.x + lateral_error) * 0.7
                
                # 최대, 최소 전방주시거리 제한 (0.1 ~ 1.0m)
                if self.lfd < self.min_lfd :
                    self.lfd=self.min_lfd
                if self.lfd > self.max_lfd:
                    self.lfd=self.max_lfd


                min_dis=float('inf')
                
                # 로직 5. 전방 주시 포인트 설정(lfd만큼 떨어진 경로점을 찾는 부분)
                for num, waypoint in enumerate(self.path_msg.poses):
                    self.current_point = waypoint.pose.position
                    # 로봇과 가장 가까운 경로점과 모든 경로점과의 거리 탐색
                    dis = sqrt(pow(self.path_msg.poses[0].pose.position.x - self.current_point.x, 2) + pow(self.path_msg.poses[0].pose.position.y - self.current_point.y, 2))
                    if abs(dis-self.lfd) < min_dis:
                        min_dis = abs(dis-self.lfd)
                        self.forward_point = self.current_point
                        self.is_look_forward_point = True
                        target_num = num

                if self.is_look_forward_point:
                    # 전방 주시 포인트
                    global_forward_point=[self.forward_point.x, self.forward_point.y, 1]

                    '''
                    로직 6. 전방 주시 포인트와 로봇 헤딩과의 각도 계산

                    (테스트) 맵에서 로봇의 위치(robot_pose_x,robot_pose_y)가 (5,5)이고, 헤딩(self.robot_yaw) 1.57 rad 일 때, 선택한 전방포인트(global_forward_point)가 (3,7)일 때
                    변환행렬을 구해서 전방포인트를 로봇 기준좌표계로 변환을 하면 local_forward_point가 구해지고, atan2를 이용해 선택한 점과의 각도를 구하면
                    theta는 0.7853 rad 이 나옵니다.
                    trans_matrix는 로봇좌표계에서 기준좌표계(Map)로 좌표변환을 하기위한 변환 행렬입니다.
                    det_tran_matrix는 trans_matrix의 역행렬로, 기준좌표계(Map)에서 로봇좌표계로 좌표변환을 하기위한 변환 행렬입니다.  
                    local_forward_point 는 global_forward_point를 로봇좌표계로 옮겨온 결과를 저장하는 변수입니다.
                    theta는 로봇과 전방 주시 포인트와의 각도입니다. 
                    '''
                    trans_matrix = np.array([       
                                            [cos(self.robot_yaw), -sin(self.robot_yaw), robot_pose_x],
                                            [sin(self.robot_yaw), cos(self.robot_yaw), robot_pose_y],
                                            [0, 0, 1]
                    ])
                    # 역행렬 만들기
                    det_trans_matrix = np.linalg.inv(trans_matrix)
                    # 글로벌 경로를 역행렬 연산 => 로컬 경로를 알아냄
                    local_forward_point = det_trans_matrix.dot(global_forward_point)
                    # 로봇과 전방주시 포인트간의 차이값 계산
                    theta = -atan2(local_forward_point[1], local_forward_point[0])
                    
                    # 로직 7. 선속도, 각속도 정하기
                    
                    # 1. normal state(경로를 잘 따라 가는 경우)
                    if self.state == 1:
                        print("state1")
                        if 0.2 < abs(theta):
                            self.out_vel = 0.0
                            self.out_rad_vel = theta * 0.35
                        else:
                            self.out_vel = 0.5
                            self.out_rad_vel = theta * 0.35
                    # 2. 전방에 장애물 존재하는 경우 우회해야 함
                    # elif self.state == 2:
                    #     # 잠시 멈춰서 회전
                    #     print("state2")
                    #     self.out_vel = 0.0
                    #     self.out_rad_vel = 0.2
                    # if self.go_backward > 0:
                    #     self.out_vel = 0.3
                    #     self.out_rad_vel = 0.0
                    #     self.go_backward -= 1
                    # if self.go_forward > 0:
                    #     self.out_vel = 0.3
                    #     self.out_rad_vel = 0.0
                    #     self.go_forward -= 1

                    # # 앞부분이 부딪혔을 때
                    # if self.collision_forward:
                    #     self.out_vel = -0.2 # 후진
                    #     self.turn_right = True # 후진이 끝나면 회전할 것
                    #     self.robot_yaw_now = self.robot_yaw # 현재 각도 저장
                    # # 뒷부분이 부딪혔을 때
                    # if self.collision_backward:
                    #     print("충돌 극복 동작")
                    #     self.out_vel = 0.2 # 전진
                    #     self.turn_right = True # 전진이 끝나면 회전할 것
                  
                    # # 회전(충돌이 해소된 후)
                    # if not self.collision_forward and not self.collision_backward and self.turn_right:
                    #     print("회전 실행")
                    #     self.out_vel = 0.0
                    #     # self.cmd_msg.angular.z = -0.3
                    #     self.out_rad_vel = 45 * pi / 180
                    #     self.cnt += 1

                    #     if self.cnt == 20:
                            
                    #         self.turn_right = False
                    #         self.cnt = 0
                   
                    self.cmd_msg.linear.x = self.out_vel
                    self.cmd_msg.angular.z = self.out_rad_vel
                    self.cmd_pub.publish(self.cmd_msg)
                    # print("linear.x: ", self.out_vel)
                    # print("angular.z: ", self.out_rad_vel)

            # 경로가 없을 때
            else:
                print("no found forward point")
                self.is_stop = True
                self.is_path = False
                self.cmd_msg.linear.x=0.0
                self.cmd_msg.angular.z=0.0
                self.cmd_pub.publish(self.cmd_msg)


    def odom_callback(self, msg):
        self.is_odom=True
        self.odom_msg=msg
        # 초기값 설정
        if self.stop_cnt <= 0:
            self.turtle_pos_x = msg.pose.pose.position.x
            self.turtle_pos_y = msg.pose.pose.position.y
            self.turtle_yaw = self.robot_yaw
            self.stop_cnt = 1
        elif self.stop_cnt > 300:
            self.is_stop = True
            # 주변 영역을 갈 수 없는 곳으로 처리하기 (value = 127)
            # 맵 자체를 다시 쓸 수는 없으니 grid 선에서 처리해야 함
            obs_msg = String()
            obs_msg.data = "obstacle_detected"
            self.obs_pub.publish(obs_msg)

        else:
            # 탈출을 시도하기 전 상태, 충돌이 일어난 것이 아닐 때
            if self.is_stop != True and not self.collision_forward and not self.collision_backward and self.path_exists:
                # 뚜렷한 이유 없이 멈춰있다면
                if abs(self.turtle_pos_x-msg.pose.pose.position.x) < 0.00001 \
                and abs(self.turtle_pos_y-msg.pose.pose.position.y) < 0.00001:
                    if abs(self.robot_yaw - self.turtle_yaw) < 0.001:
                        self.stop_cnt += 1
                        print(self.stop_cnt)
                else:
                    self.turtle_pos_x = msg.pose.pose.position.x
                    self.turtle_pos_y = msg.pose.pose.position.y
                    self.turtle_yaw = self.robot_yaw

        # 로직 3. Quaternion 을 euler angle 로 변환
        q = Quaternion(msg.pose.pose.orientation.w, msg.pose.pose.orientation.x, msg.pose.pose.orientation.y, msg.pose.pose.orientation.z)
        _, _, self.robot_yaw = q.to_euler()

    
    def path_callback(self, msg):
        self.is_path=True
        self.path_msg=msg
        if len(self.path_msg.poses) < 3:
            self.path_exists = False
        else:
            self.path_exists = True


    def status_callback(self,msg):
        self.is_status=True
        self.status_msg=msg
        
    # 라이다 데이터 수신시 호출되는 콜백함수
    def lidar_callback(self, msg):
        self.is_lidar = True
        self.lidar_msg = msg
        # 경로와 위치를 알고 있어야 하기 때문에 알고 있는지 체크
        if self.is_path == True and self.is_odom == True:
            # 직교좌표계 데이터를 가질 포인트클라우드 생성
            pcd_msg = PointCloud()
            pcd_msg.header.frame_id = 'map'
            # 로컬 to 글로벌 변환 행렬
            pose_x = self.odom_msg.pose.pose.position.x
            pose_y = self.odom_msg.pose.pose.position.y
            theta = self.robot_yaw
            t = np.array([[cos(theta), -sin(theta), pose_x],
                          [sin(theta), cos(theta), pose_y],
                          [0, 0, 1]])
            # 극좌표계를 직교좌표계로 만들기
            for angle, r in enumerate(msg.ranges):
                global_point = Point32()

                if 0.0 < r < 12:
                    # 극좌표계를 로봇 기준(로컬) 직교좌표계로
                    local_x = r*cos(angle*pi/180)
                    local_y = r*sin(angle*pi/180)
                    local_point = np.array([[local_x], [local_y], [1]])
                    # 로컬 직교좌표계를 맵 기준(글로벌) 직교좌표계로
                    global_result = t.dot(local_point)
                    global_point.x = global_result[0][0]
                    global_point.y = global_result[1][0]
                    # 포인트 클라우드에 맵 기준 직교좌표계 데이터 추가
                    # 퍼블리시는 하지 않았지만 확인하고 싶으면 pcd_msg를 퍼블리시해서 rviz에서 확인할 것
                    pcd_msg.points.append(global_point)

            # 전/후방 충돌 감지
            self.collision = False
            forward_right = self.lidar_msg.ranges[0:10] # 정면의 라이다 값
            forward_left = self.lidar_msg.ranges[350:360]
            # 만약 앞쪽이 부딪혔다면 forward_right와 forward_left의 평균을 낸 값이 0.1 이하일 것이다.
            forward = (sum(forward_right) + sum(forward_left)) / 20
            print("forward: ", forward)
            if forward < 0.1:
                self.collision_forward = True
                print("전방 충돌")
            else:
                self.collision_forward = False
            backward = self.lidar_msg.ranges[170:190]
            backward = sum(backward) / 20
            if backward < 0.1:
                self.collision_backward = True
                print("후방 충돌")
            else:
                self.collision_backward = False
            
            # 조금 더 넓은 범위로, 전방에 물체나 벽이 있는지 확인하기
            if forward < 1.0:
                print("전방 물체 감지")
                self.forward_obs = True
                self.state = 2

                if self.go_backward == 1:
                    self.go_forward = 10

            elif forward > 2.0:
                self.forward_obs = False
                # state2에서 다시 state1로 바뀐 경우 장애물이 없는 방향으로 회전을 완료한 것
                if self.state == 2:
                    # 열 번 직진 명령을 내려라
                    self.go_backward = 10
                self.state= 1
            # if backward < 0.5:
            #     print("후방 물체 감지")
            #     self.backward_obs = True
            #     self.state = 3
            # else:
            #     self.backward_obs = False
            #     self.state = 1

        
def main(args=None):
    rclpy.init(args=args)

    path_tracker = followTheCarrot()

    rclpy.spin(path_tracker)


    path_tracker.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main() # 선속도와 각속도로 두가지를 구합니다. 