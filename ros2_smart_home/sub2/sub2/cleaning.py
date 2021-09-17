import rclpy
from rclpy.node import Node
import random
from geometry_msgs.msg import Twist,Point, Point32
from ssafy_msgs.msg import TurtlebotStatus
from squaternion import Quaternion
from nav_msgs.msg import Odometry,Path
from math import pi,cos,sin,sqrt,atan2
import numpy as np
from collections import deque
from sensor_msgs.msg import LaserScan, PointCloud
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

class cleaning(Node):
    def __init__(self):
        super().__init__('cleaning')
        # 로봇을 움직이게 하는 부분
        self.cmd_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        # 로봇의 현재 위치
        self.subscription = self.create_subscription(Odometry,'/odom',self.odom_callback,10)
        self.status_sub = self.create_subscription(TurtlebotStatus,'/turtlebot_status',self.status_callback,10)
        # 경로 받아오기
        # self.path_sub = self.create_subscription(Path,'/local_path',self.path_callback,10)
        # 라이다 데이터 구독
        self.lidar_sub = self.create_subscription(LaserScan, '/scan', self.lidar_callback, 10)

        # 로직 1. 제어 주기 및 타이머 설정
        time_period=0.05 
        self.timer = self.create_timer(time_period, self.timer_callback)

        self.is_odom = False
        self.is_path = False
        self.is_status = False
        self.collision_forward = False
        self.collision_backward = False
        self.turn_left = False
        self.odom_msg=Odometry()            
        self.robot_yaw=0.0
        self.robot_yaw_now=0.0 # 회전하기 전 로봇의 각도
        self.path_msg=Path()
        self.cmd_msg=Twist()
        self.cnt = 0
        # 로직 2. 파라미터 설정(전방주시거리)
        self.lfd=0.1
        self.min_lfd=0.1
        self.max_lfd=1.0


    def timer_callback(self):
        # 로봇이 멈춰있는지 여부 확인하기
        # ???

        # 이동
        if self.is_status and self.is_odom == True and not self.turn_left:
            
            # 로봇의 현재 위치를 나타내는 변수
            robot_pose_x = self.odom_msg.pose.pose.position.x
            robot_pose_y = self.odom_msg.pose.pose.position.y


            out_vel = 0.5
            out_rad_vel = 0.0
            # print("각도차 작을 때: ", theta)
                

            self.cmd_msg.linear.x = out_vel
            self.cmd_msg.angular.z = out_rad_vel
            # 일단 직진
            self.cmd_pub.publish(self.cmd_msg)
            print(self.robot_yaw * 180 / pi)                   
        
        # 이유 모르고 터틀봇이 정지해있을 때
        if self.status_msg.twist.linear.x and robot_yaw의 편차가 매우 작을 때:
            self.cmd_msg.linear.x = -out_vel # 반대 방향으로 움직이기
            self.turn_left = True
            self.cmd_pub.publish(self.cmd_msg)

        # 앞부분이 부딪혔을 때
        if self.collision_forward:
            self.cmd_msg.linear.x=-0.1
            self.turn_left = True # 후진이 끝나면 회전할 것
            self.robot_yaw_now = self.robot_yaw # 현재 각도 저장
            # 일단 후진
            self.cmd_pub.publish(self.cmd_msg)
            
        if not self.collision_forward and self.turn_left:
            self.cmd_msg.linear.x = 0.0
            # self.cmd_msg.angular.z = -0.3
            self.cmd_msg.angular.z = random.random()
            self.cnt += 1
            print(self.cnt)
            # print("저장 각도: ", self.robot_yaw_now * 180 / pi)
            # print("현재 각도: ", self.robot_yaw * 180 / pi)
            # if (self.robot_yaw_now * 180 / pi) + 88 < (self.robot_yaw * 180 / pi) < (self.robot_yaw_now * 180 / pi) + 92:
                # self.cmd_msg.angular.z = 0.0
            if self.cnt == 50:
                
                self.turn_left = False
                self.cnt = 0

            self.cmd_pub.publish(self.cmd_msg)

        if self.collision_backward:
            self.cmd_msg.linear.x=0.3
            self.cmd_msg.angular.z=-0.2

        

            

    def odom_callback(self, msg):
        self.is_odom=True
        self.odom_msg=msg

        # 로직 3. Quaternion 을 euler angle 로 변환
        q = Quaternion(msg.pose.pose.orientation.w, msg.pose.pose.orientation.x, msg.pose.pose.orientation.y, msg.pose.pose.orientation.z)
        _, _, self.robot_yaw = q.to_euler()

    def status_callback(self,msg):
        self.is_status=True
        self.status_msg=msg
        
    # 라이다 데이터 수신시 호출되는 콜백함수
    def lidar_callback(self, msg):
        self.lidar_msg = msg
        # 경로와 위치를 알고 있어야 하기 때문에 알고 있는지 체크
        if self.is_odom == True:
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
            forward = (sum(forward_right) + sum(forward_left)) / 9
            if forward < 0.1:
                self.collision_forward = True
                print("전방 충돌")
            else:
                self.collision_forward = False
            backward = self.lidar_msg.ranges[176:185]
            backward = sum(backward) / 9
            if backward < 0.1:
                self.collision_backward = True
                print("후방 충돌")
            else:
                self.collision_backward = False
            self.is_lidar = True

        
def main(args=None):
    rclpy.init(args=args)
    cleaner = cleaning()
    rclpy.spin(cleaner)
    cleaner.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()