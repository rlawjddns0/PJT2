
import rclpy
from rclpy.node import Node
from nav_msgs.msg import Odometry,Path
from geometry_msgs.msg import Twist, Point, Point32, Pose, PoseStamped
from squaternion import Quaternion
from math import pi,cos,sin,sqrt,atan2
from sensor_msgs.msg import LaserScan, PointCloud
from nav_msgs.msg import Odometry,OccupancyGrid,MapMetaData,Path
import numpy as np
import time

import socketio
sio = socketio.Client()

global m_control_cmd, x_min, x_max, y_min, y_max
m_control_cmd, x_min, x_max, y_min, y_max = 0, 0, 0, 0, 0

@sio.event
def connect():
    print('connection established')

@sio.event
def disconnect():
    print('disconnected from server')

@sio.on('cleanerControl')
def turn_on_cleaner(data):
    global m_control_cmd, x_min, x_max, y_min, y_max
    print(data)
    m_control_cmd = data[0]["no"]
    x_min = data[0]["x1"]
    x_max = data[0]["x2"]
    y_min = data[0]["y1"]
    y_max = data[0]["y2"]
    print("2: ", m_control_cmd, x_min, x_max, y_min, y_max)
    # m_control_cmd, x_min, x_max, y_min, y_max = data[0], data[1], data[2], data[3], data[4]

def get_global_var():
    return m_control_cmd, x_min, x_max, y_min, y_max

def reset_global_var():
    global m_control_cmd
    m_control_cmd = 0
    x_min, x_max, y_min, y_max = 0

class cleaning(Node):
    def __init__(self):
        super().__init__('cleaning')
        sio.connect('http://j5b202.p.ssafy.io:12001/')
        self.goal_pub = self.create_publisher(PoseStamped, 'goal_pose', 10)
        # 맵 받아오기(이동 가능한 영역인지 확인하기 위함)
        self.map_msg=OccupancyGrid()
        self.is_map = False
        self.is_grid_update = False
        self.is_new_command = False

        # 맵과 남은 경로 받아오기
        self.map_sub = self.create_subscription(OccupancyGrid,'map', self.map_callback,1)
        self.path_sub = self.create_subscription(Path,'/local_path',self.path_callback,10)
        # 라이다 데이터 구독
        self.lidar_sub = self.create_subscription(LaserScan, '/scan', self.lidar_callback, 10)
        # 정지 상태 확인을 위함
        self.subscription = self.create_subscription(Odometry,'/odom',self.odom_callback,10)
        self.is_path = False
        self.is_odom = False
        self.is_stop = True
        self.stop_cnt = 0
        self.odom_msg=Odometry()
        self.robot_yaw = 0
        # 경로가 존재하는지 확인하기 위함
        self.path_exists = False
        time_period = 0.05
        self.point = [0, 0]
        self.i = 0
        self.j = 0
        self.map_resolution=0.05
        self.map_offset_x=-8-8.75
        self.map_offset_y=-4-8.75

        # for lidar
        self.forward = 999
        self.backward = 999
        self.collision_forward = False
        self.collision_backward = False
        self.collision_forward_cnt = 0
        self.collision_backward_cnt = 0
        self.forward_obs = False
        self.backward_obs = False

        # for select xy
        self.ctrl_cmd = 0
        self.x_min = 0
        self.x_max = 0
        self.y_min = 0
        self.y_max = 0

        self.goal_comeback = False

        self.timer = self.create_timer(time_period, self.timer_callback)

    def odom_callback(self, msg):
        self.is_odom=True
        self.odom_msg=msg
        # print("현재 위치: ", self.odom_msg.pose.pose.position.x, self.odom_msg.pose.pose.position.y)
        # 정지 상태 - 초기값 설정
        if self.stop_cnt <= 0:
            self.turtle_pos_x = msg.pose.pose.position.x
            self.turtle_pos_y = msg.pose.pose.position.y
            self.is_stop = False
            self.stop_cnt = 1
        # stop_cnt가 300 이상이면 완전 정지 상태로 판단
        elif self.stop_cnt > 300:
            self.is_stop = True
            # 전방 충돌과 후방 충돌 중 하나로 가정하고 움직이기(랜덤)
            self.stop_cnt = 0
        else:
            # stop_cnt가 1에서 300 이하인 경우 현재 멈춰있는지 판단해야 함
            # 탈출을 시도하기 전 상태, 충돌이 일어난 것이 아닐 때
            if not self.collision_forward and not self.collision_backward:
                # 저장해놓은 위치와 현재 위치 사이의 거리를 계산
                distance = sqrt((self.turtle_pos_x-msg.pose.pose.position.x) ** 2 + \
                (self.turtle_pos_y-msg.pose.pose.position.y) ** 2)
                # 거리 차이가 매우 작으면 현재 정지 상태로 판단
                if distance < 0.001:
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
        q = Quaternion(msg.pose.pose.orientation.w, msg.pose.pose.orientation.x, msg.pose.pose.orientation.y, msg.pose.pose.orientation.z)
        _, _, self.robot_yaw = q.to_euler()        

    def map_callback(self,msg):
        self.is_map = True
        self.map_msg=msg

    def path_callback(self, msg):
        self.is_path = True
        # 더 이상 경로가 없을 때
        self.path_msg=msg
        if len(self.path_msg.poses) < 5: # 도착 조건을 약간 느슨하게 하는게 좋을 듯..
            self.path_exists = False
        else:
            self.path_exists = True
        
        # 임시 확인용
        # print(len(self.path_msg.poses))

    # 맵 데이터 행렬로 바꾸기
    def grid_update(self):
        self.is_grid_update = True
        map_to_grid = np.array(self.map_msg.data)
        self.grid = np.reshape(map_to_grid, (350,350), order='F')

    # grid 좌표 x, y로 바꾸기
    def grid_cell_to_pose(self,grid_cell):
        x=(grid_cell[0] * self.map_resolution) + self.map_offset_x
        y=(grid_cell[1] * self.map_resolution) + self.map_offset_y
        return [x,y]

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
            else:
                self.collision_forward = False

            backward = self.lidar_msg.ranges[176:185]
            self.backward = sum(backward) / 9
            if self.backward < 0.1:
                self.collision_backward_cnt += 1
                if self.collision_backward_cnt == 10:
                    self.collision_backward = True
            else:
                self.collision_backward = False

    def timer_callback(self):
        global m_control_cmd
        ctrl_cmd, x_min, x_max, y_min, y_max = get_global_var()
        if self.ctrl_cmd != ctrl_cmd: # 입력이 달라지면 즉시 반영해야 함
            self.is_grid_update = False
            self.ctrl_cmd = ctrl_cmd
        if ctrl_cmd > 0:
            self.goal_comeback = False
            self.x_min = x_min
            self.x_max = x_max
            self.y_min = y_min
            self.y_max = y_max
            if self.is_map == True:
                if self.is_grid_update == False:
                    # grid 맵 가져오기
                    self.grid_update()
                    self.alt = 0
                    print("map 가져오기 완료")
                    flag = False
                    for i in range(self.x_min, self.x_max):
                        if flag:
                            break
                        for j in range(self.y_min, self.y_max):
                            # 처음으로 갈 수 있는 지점
                            if self.grid[i][j] == 0:
                                self.point[0] = i
                                self.point[1] = j
                                self.i = i
                                self.j = j
                                flag = True
                                break
                    

            # 경로가 없거나 멈춰있을 때 새로운 경로를 찍을 것이다.
            if self.is_grid_update:
                if self.path_exists == False or (self.is_odom == True and self.is_stop == True):
                    goal = PoseStamped()
                    self.point[0] = self.i
                    self.point[1] = self.j
                    if self.grid[self.point[0]][self.point[1]] == 0:
                        selected_point = self.grid_cell_to_pose(self.point)
                        goal.pose.position.x = selected_point[0]
                        goal.pose.position.y = selected_point[1]
                        print(selected_point)
                        goal.header.frame_id = 'map'
                        goal.pose.orientation.w = 1.0

                        print("이동!")
                        self.goal_pub.publish(goal)
                        print("3초 딜레이")
                        time.sleep(1)
                    else:
                        print(self.point[0], self.point[1])
                        print("이동 가능한 위치가 아닙니다.")
                    # 다음 입력할 위치 선정
                    self.j += 10
                    if self.j >= self.y_max: # j를 다 해봤으면
                        # i 변경
                        self.i += 10
                        self.j = self.y_min
                    if self.i >= self.x_max:
                        print("모두 청소 완료!")
                        if self.alt == 0:
                            sio.emit("alertToServer", "청소 끝!")
                            print("송신 완료!")
                            self.alt = 1
                            m_control_cmd = 0
        # 청소 모드가 아닐 때
        else:
            # 기본 위치(충전 장소)
            if self.goal_comeback == False:
                goal = PoseStamped()
                selected_point = self.grid_cell_to_pose([146, 100])
                goal.pose.position.x = selected_point[0]
                goal.pose.position.y = selected_point[1]
                goal.header.frame_id = 'map'
                goal.pose.orientation.w = 1.0
                print("복귀!")
                self.goal_pub.publish(goal)
                self.goal_comeback = True


def main(args=None):
    rclpy.init(args=args)

    global_planner = cleaning()
    rclpy.spin(global_planner)

    global_planner.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()