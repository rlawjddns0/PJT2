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

import socketio
sio = socketio.Client()
# [[x, y, idx, state], [x, y, idx, state], [x, y, idx, state], ...]
@sio.event
def connect():
    print('connection established')

@sio.event
def disconnect():
    print('disconnected from server')

global ctrl
ctrl = False


@sio.on('patrolOn')
def patrol_on():
    global ctrl
    ctrl = True

@sio.on('patrolOff')
def patrol_off():
    global ctrl
    ctrl = False

def get_global_var():
    return ctrl

class patrol(Node):
    def __init__(self):
        super().__init__('patrol')
        sio.connect('http://j5b202.p.ssafy.io:12001/')
        # 로봇을 움직이게 하는 부분
        self.ctrl = get_global_var()
        self.cmd_pub = self.create_publisher(Twist, 'cmd_vel', 10)
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
        self.is_status = False
        self.collision_forward = False
        self.collision_backward = False
        self.turn_right = False


        self.map_msg=OccupancyGrid()
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


        self.out_vel = 0.5
        self.out_rad_vel = 0.0

        self.stop_cnt = 0 # 터틀봇이 멈춰 있는지 판단하는 간격을 정하기 위한 변수
        self.is_stop = False # 터틀봇의 정지 여부 판단



    def timer_callback(self):
        # patrol mode가 켜졌고, a_star로 만들어진 경로가 따로 없을 때 작동(가야 할 좌표가 없을 때)
        if ctrl == True and self.is_path != True:
            # 1. 로봇이 멈춰있는지 여부 확인하기
            if self.is_status and self.is_odom == True and self.is_stop == True:
                print("cmd_msg.linear.x: ", self.out_vel)
                self.out_vel = -0.3
                self.out_rad_vel = 0.2
                self.stop_cnt -= 1
                if self.stop_cnt == 270:
                    self.stop_cnt = 0
                    self.out_rad_vel = 0.0
                    self.is_stop = False

            # 2. 이동
            if self.is_status and self.is_odom == True and not self.turn_right and not self.is_stop:
                
                # 로봇의 현재 위치를 나타내는 변수
                robot_pose_x = self.odom_msg.pose.pose.position.x
                robot_pose_y = self.odom_msg.pose.pose.position.y
                self.out_vel = 0.5
                self.out_rad_vel = 0.0            
            

            # 3. 앞부분이 부딪혔을 때
            if self.collision_forward:
                # 미지의 이유로 멈춘게 아니므로 stop_cnt = 0
                # self.stop_cnt = 0
                self.out_vel = -0.2 # 후진
                self.turn_right = True # 후진이 끝나면 회전할 것
                self.robot_yaw_now = self.robot_yaw # 현재 각도 저장

            # 4. 뒷부분이 부딪혔을 때
            if self.collision_backward:
                # 미지의 이유로 멈춘게 아니므로 stop_cnt = 0
                # self.stop_cnt = 0
                self.out_vel = 0.2 # 전진
                self.turn_right = True # 전진이 끝나면 회전할 것
            
            # 5. 회전(충돌이 해소된 후)
            if not self.collision_forward and not self.collision_backward and self.turn_right:
                print("실행")
                self.out_vel = 0.0
                # self.cmd_msg.angular.z = -0.3
                self.out_rad_vel = 30 * pi / 180
                self.cnt += 1

                if self.cnt == 20:
                    
                    self.turn_right = False
                    self.cnt = 0

            self.cmd_msg.linear.x = self.out_vel
            self.cmd_msg.angular.z = self.out_rad_vel
            self.cmd_pub.publish(self.cmd_msg)
            print(self.stop_cnt)
        else:
            print("patrol mode off!")

            

    def odom_callback(self, msg):
        self.is_odom=True
        self.odom_msg=msg
        # 초기값 설정
        if self.stop_cnt <= 0:
            self.turtle_pos_x = msg.pose.pose.position.x
            self.turtle_pos_y = msg.pose.pose.position.y
            self.stop_cnt = 1
            print("초기 설정 완료")
        elif self.stop_cnt > 300:
            self.is_stop = True
        else:
            # 탈출을 시도하기 전 상태, 충돌이 일어난 것이 아닐 때
            if self.is_stop != True and not self.collision_forward and not self.collision_backward:
                # 뚜렷한 이유 없이 멈춰있다면
                if abs(self.turtle_pos_x-msg.pose.pose.position.x) < 0.0001 \
                and abs(self.turtle_pos_y-msg.pose.pose.position.y) < 0.0001:
                    print("정지 상태: x {}, y {}".format(self.turtle_pos_x, self.turtle_pos_y))
                    self.stop_cnt += 1
                else:
                    self.turtle_pos_x = msg.pose.pose.position.x
                    self.turtle_pos_y = msg.pose.pose.position.y


        # 로직 3. Quaternion 을 euler angle 로 변환
        q = Quaternion(msg.pose.pose.orientation.w, msg.pose.pose.orientation.x, msg.pose.pose.orientation.y, msg.pose.pose.orientation.z)
        _, _, self.robot_yaw = q.to_euler()

    def status_callback(self,msg):
        self.is_status=True
        self.status_msg=msg

    def path_callback(self,msg):
        self.path_msg=msg
        if len(self.path_msg.poses) < 2:
            self.is_path = False
        else:
            self.is_path = True
        
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
    patroller = patrol()
    rclpy.spin(patroller)
    patroller.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
