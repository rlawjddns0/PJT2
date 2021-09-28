import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, Point, Point32, Pose, PoseStamped
from ssafy_msgs.msg import TurtlebotStatus
from squaternion import Quaternion
from nav_msgs.msg import Odometry,Path
from math import pi,cos,sin,sqrt,atan2
import numpy as np
from sensor_msgs.msg import LaserScan, PointCloud
from std_msgs.msg import String
import time
import random
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

        # goal_pose 통신 subscribe
        self.goal_sub = self.create_subscription(PoseStamped,'goal_pose', self.goal_callback,1)

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
        self.is_goal = False
        self.path_exists = False
        self.is_status = False
        self.forward = 999
        self.backward = 999
        self.collision_forward = False
        self.collision_backward = False
        self.collision_forward_cnt = 0
        self.collision_backward_cnt = 0
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

        self.turn_cnt = 0
        self.go_cnt = 0
        self.back_cnt = 0

        self.state = 1

        # goal 전용
        self.map_size_x=350
        self.map_size_y=350
        self.map_resolution=0.05
        self.map_offset_x=-8-8.75
        self.map_offset_y=-4-8.75

    def timer_callback(self):
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
                        # print("state1")
                        if 0.2 < abs(theta):
                            self.out_vel = 0.0
                            self.out_rad_vel = theta * 0.35
                        else:
                            self.out_vel = 0.5
                            self.out_rad_vel = theta * 0.35
                        
                    # 전방 충돌 상황
                    if self.state == 2:
                        self.out_vel = -0.5
                        self.out_rad_vel = 0.0
                        # 일정 거리 이상 충돌로부터 멀어진 경우
                        if self.forward > 0.5:
                            self.turn_cnt = 20
                            self.state = 8 # 회전 조건
                    # 후방 충돌 상황
                    if self.state == 3:
                        self.out_vel = 0.5
                        self.out_rad_vel = 0.0
                        # 일정 거리 이상 충돌로부터 멀어진 경우
                        if self.backward > 0.5:
                            self.turn_cnt = 20
                            self.state = 8 # 회전 조건

                    # 오른쪽 방향으로 회전
                    if self.state == 8 and self.turn_cnt > 0:
                        self.out_vel = 0.0
                        self.out_rad_vel = 20* pi / 180
                        self.turn_cnt -= 1
                        # 회전 종료 조건
                        if self.turn_cnt == 0:
                            print("회전 종료")
                            self.state = 6 # 직진 조건
                            self.go_cnt = 30
                            self.out_rad_vel = 0.0
                    # 직진
                    if self.state == 6 and self.go_cnt > 0:
                        self.out_vel = 1.0
                        self.out_rad_vel = 0.0
                        self.go_cnt -= 1
                        if self.go_cnt == 0:
                            print("직진 종료")
                            self.state = 1
                    # 후진(아직 사용은 안함)
                    if self.state == 7 and self.go_cnt > 0:
                        self.out_vel = -0.5
                        self.out_rad_vel = 0.0
                        self.back_cnt -= 1

                    self.cmd_msg.linear.x = self.out_vel
                    self.cmd_msg.angular.z = self.out_rad_vel
                    self.cmd_pub.publish(self.cmd_msg)
                    # print("linear.x: ", self.out_vel)
                    # print("angular.z: ", self.out_rad_vel)
            # 목적지는 있는데 경로가 만들어지지 않는 경우(터틀봇이 잘못된 위치에 있음)
            elif self.is_status and self.is_odom and self.is_goal and (self.goal != self.current_pos) and not self.path_exists:
                print("통과!")
                # 목적지가 있으면 goal_pose 통신이 이루어진다.
                # 전방, 후방 lidar distance 확인 후 더 먼 쪽으로 이동한다.
                if self.forward > self.backward:
                    self.out_vel = 0.5
                    self.out_rad_vel = 0.1
                else:
                    self.out_vel = -0.5
                    self.out_rad_vel = 0.1
                self.cmd_msg.linear.x = self.out_vel
                self.cmd_msg.angular.z = self.out_rad_vel
                self.cmd_pub.publish(self.cmd_msg)
                print("x", self.out_vel)
                print("angular", self.out_rad_vel)

            # 경로가 없을 때
            else:
                print("no found forward point")
                self.is_stop = True
                self.is_path = False
                self.cmd_msg.linear.x=0.0
                self.cmd_msg.angular.z=0.0
                self.cmd_pub.publish(self.cmd_msg)
            if random.randint(0, 31) > 27:
                self.out_vel = 0.5
                self.out_rad_vel = 0.3
                self.cmd_msg.linear.x = self.out_vel
                self.cmd_msg.angular.z = self.out_rad_vel
                self.cmd_pub.publish(self.cmd_msg)
            elif random.randint(0, 30) < 3:
                self.out_vel = -0.5
                self.out_rad_vel = -0.3
                self.cmd_msg.linear.x = self.out_vel
                self.cmd_msg.angular.z = self.out_rad_vel
                self.cmd_pub.publish(self.cmd_msg)

    def odom_callback(self, msg):
        self.is_odom=True
        print("상태: ", self.state)
        self.odom_msg=msg
        self.current_x, self.current_y = self.pose_to_grid_cell(self.odom_msg.pose.pose.position.x, self.odom_msg.pose.pose.position.y)
        self.current_pos = [self.current_x, self.current_y]
        # print("self.state", self.state)
        # 정지 상태 - 초기값 설정
        print(self.stop_cnt)
        if self.stop_cnt <= 0:
            self.turtle_pos_x = msg.pose.pose.position.x
            self.turtle_pos_y = msg.pose.pose.position.y
            self.stop_cnt = 1
        # stop_cnt가 300 이상이면 완전 정지 상태로 판단
        elif self.stop_cnt > 300:
            self.is_stop = True
            self.state = 2
            self.stop_cnt = 0
        else:
            # stop_cnt가 1에서 300 이하인 경우 현재 멈춰있는지 판단해야 함
            # 탈출을 시도하기 전 상태, 충돌이 일어난 것이 아닐 때
            if not self.collision_forward and not self.collision_backward:
                # 저장해놓은 위치와 현재 위치 사이의 거리를 계산
                distance = sqrt((self.turtle_pos_x-msg.pose.pose.position.x) ** 2 + \
                (self.turtle_pos_y-msg.pose.pose.position.y) ** 2)
                # 거리 차이가 매우 작으면 현재 정지 상태로 판단
                # print(distance)
                if distance < 0.0001:
                    self.stop_cnt += 1 # 정지 상태가 일정 시간 지나면 탈출 로직 작동
                else:
                    self.turtle_pos_x = msg.pose.pose.position.x
                    self.turtle_pos_y = msg.pose.pose.position.y
                    self.is_stop = False
                    self.stop_cnt -= 5 # 잠깐이라도 정지 상태가 풀리면 정지 상태 감소,
                    # 초기화 하고 싶지만 누적 오차때문에 distance가 점점 커지므로 
                    # 초기화하면 stop_cnt가 특정 값에 도달하지 못해 영영 안 움직일 수 있다.
                    if self.stop_cnt < 0:
                        self.stop_cnt = 0

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
            forward_right = self.lidar_msg.ranges[0:5] # 정면의 라이다 값
            forward_left = self.lidar_msg.ranges[356:360]

            # 만약 앞쪽이 부딪혔다면 forward_right와 forward_left의 평균을 낸 값이 0.1 이하일 것이다.
            self.forward = (sum(forward_right) + sum(forward_left)) / 9
            if self.forward < 0.1:
                self.collision_forward_cnt += 1
                if self.collision_forward_cnt == 10: # robust하게 만들기 위함
                    self.collision_forward = True
                    self.state = 2
                    self.collision_forward_cnt = 0  # 초기화
                print("전방 충돌")
            else:
                self.collision_forward = False

            backward = self.lidar_msg.ranges[176:185]
            self.backward = sum(backward) / 9
            if self.backward < 0.1:
                self.collision_backward_cnt += 1
                if self.collision_backward_cnt == 10:
                    self.collision_backward = True
                    self.state = 3
                    self.collision_backward_cnt = 0 
                print("후방 충돌")
            else:
                self.collision_backward = False

    def goal_callback(self,msg):
        self.is_goal = True
        if msg.header.frame_id=='map':
            goal_x=msg.pose.position.x
            goal_y=msg.pose.position.y
            goal_cell=self.pose_to_grid_cell(goal_x,goal_y)
            self.goal = [goal_cell[0], goal_cell[1]] 
            print("목표 지점: ", self.goal)

    # goal callback용
    def pose_to_grid_cell(self,x,y):

        map_point_x=0
        map_point_y=0  
        '''
        로직 4. 위치(x,y)를 map의 grid cell로 변환 
        (테스트) pose가 (-8,-4)라면 맵의 중앙에 위치하게 된다. 따라서 map_point_x,y 는 map size의 절반인 (175,175)가 된다.
        pose가 (-16.75,-12.75) 라면 맵의 시작점에 위치하게 된다. 따라서 map_point_x,y는 (0,0)이 된다.
        '''
        map_point_x= int(( x - self.map_offset_x ) / self.map_resolution)
        map_point_y= int(( y - self.map_offset_y ) / self.map_resolution)
        return map_point_x,map_point_y

        
def main(args=None):
    rclpy.init(args=args)

    path_tracker = followTheCarrot()

    rclpy.spin(path_tracker)


    path_tracker.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main() # 선속도와 각속도로 두가지를 구합니다. 