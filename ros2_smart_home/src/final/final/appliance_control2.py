import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, Point, Point32, Pose, PoseStamped
from std_msgs.msg import Float32,Int8MultiArray
from nav_msgs.msg import Path
# 변수 받기
import sys

import socketio
sio = socketio.Client()

@sio.event
def connect():
    print('connection established')

@sio.event
def disconnect():
    print('disconnected from server')

# appliances index
global num
num = 0
global datas
datas = 0
# datas = [
#     {"x": 241, "y": 103, "idx": 0, "state": 2},
#     {"x": 241, "y": 103, "idx": 1, "state": 2},
#     {"x": 241, "y": 103, "idx": 2, "state": 2},
#     {"x": 241, "y": 103, "idx": 3, "state": 2},
#     {"x": 241, "y": 103, "idx": 4, "state": 2},
#     {"x": 147, "y": 100, "idx": 5, "state": 2},
#     {"x": 147, "y": 100, "idx": 6, "state": 2},
#     {"x": 147, "y": 100, "idx": 7, "state": 2},
#     {"x": 147, "y": 100, "idx": 8, "state": 2},
#     {"x": 147, "y": 100, "idx": 9, "state": 2},
#     {"x": 192, "y": 225, "idx": 10, "state": 2},
#     {"x": 135, "y": 152, "idx": 11, "state": 2},
#     {"x": 135, "y": 152, "idx": 12, "state": 2},
#     {"x": 135, "y": 152, "idx": 13, "state": 2},
#     {"x": 135, "y": 152, "idx": 14, "state": 2},
#     {"x": 135, "y": 152, "idx": 15, "state": 2},
#     {"x": 135, "y": 152, "idx": 16, "state": 2},
#     ]
# appliance variables
global x, y, idx, state
x, y, idx, state = 0, 0, 0, 0

@sio.on('applianceControl')
def appliance_var(data):
    global num, datas
    datas = data
    num = len(data) # 모드 설정이면 len = 17, 개별 on/off 면 len = 1일 것

# 이 함수에 datas와 
def appliance_select(data, cnt):
    global x, y, idx, state
    x = data[cnt]["x"]
    y = data[cnt]["y"]
    idx = data[cnt]["idx"]
    state = data[cnt]["state"]

def get_global_var():
    return x, y, idx, state

def reset_global_var():
    global x, y, idx, state
    x, y, idx, state = 0, 0, 0, 0

class appliance_control(Node):
    def __init__(self):
        super().__init__('goal_change')
        sio.connect('http://j5b202.p.ssafy.io:12001/')
        x, y, idx, state = get_global_var()
        self.datas = 0
        self.target = idx # 목표 가전
        self.state = state # 켤지 끌지
        # 로직 1. publisher, subscriber 만들기
        time_period = 0.05
        self.point = [0, 0] # x, y가 들어갈 것
        self.map_resolution=0.05
        self.map_offset_x=-8-8.75
        self.map_offset_y=-4-8.75
        self.selected_list = []
        # 앱 제어 관련 변수
        self.is_app_status=False # 앱 상태가 들어오는지
        self.app_status_msg=Int8MultiArray()
        self.app_control_pub = self.create_publisher(Int8MultiArray, 'app_control', 10) # 컨트롤
        self.app_status_sub = self.create_subscription(Int8MultiArray,'/app_status',self.app_callback,10) # 메시지 수신

        # 로봇 추가 조작
        self.cmd_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.cmd_msg=Twist()

        # 가전 컨트롤
        self.app_control_msg=Int8MultiArray()
        for i in range(17):
            self.app_control_msg.data.append(0) # 컨트롤 메시지 초기화

        self.goal_pub = self.create_publisher(PoseStamped, 'goal_pose', 10)
        self.path_sub = self.create_subscription(Path,'/local_path',self.path_callback,10)
        self.path_exists = True

        # 다음 가전으로 넘어가기
        self.flag = False

        self.goal_callback()
        self.timer = self.create_timer(time_period, self.timer_callback)

    def path_callback(self, msg):
        self.is_path=True
        self.path_msg=msg
        if len(self.path_msg.poses) < 5:
            self.path_exists = False
        else:
            self.path_exists = True

    def grid_cell_to_pose(self,grid_cell):
        # 로직 5. map의 grid cell을 위치(x,y)로 변환
        x=(grid_cell[0] * self.map_resolution) + self.map_offset_x
        y=(grid_cell[1] * self.map_resolution) + self.map_offset_y
        return [x,y]
    
    # 앱 상태 전달
    def app_callback(self, msg):
        self.is_app_status=True
        self.app_status_msg=msg

    def goal_callback(self):
        goal = PoseStamped()
        selected_point = self.grid_cell_to_pose(self.point)
        goal.pose.position.x = selected_point[0]
        goal.pose.position.y = selected_point[1]
        print(selected_point)
        goal.header.frame_id = 'map'
        goal.pose.orientation.w = 1.0 # 방향.. 일단 이렇게만 해놓음
        # 시간 넣으려고 했는데 잘 안됨
        # goal.header.stamp = timeNow.get_clock().now().to_msg()

        # pose Stamp는 바뀌는 것 같은데 A*가 실행되지 않음
        self.goal_pub.publish(goal)

    def timer_callback(self):
        global datas
        if datas == 0:
            print("제어 요청이 들어오지 않음")
        else:
            # 한 가지 가전의 상태만 제어하는 경우
            if len(datas) < 2:
                # 상태를 바꿔야 할 가전 제품의 datas에서의 인덱스는 0으로 고정
                self.selected_list = [0]
            else:
                # selected list에 상태를 바꿔야 할 가전 제품의 인덱스를 모두 넣음
                if datas != self.datas: # 이전에 들어온 데이터와 다른 데이터가 들어오면
                    if self.is_app_status: 
                        self.selected_list = []
                        self.datas = datas # 일단 같게 만들어주고 (중복 확인 방지)
                        # 초기화
                        self.point = [0, 0]
                        self.target = 0
                        self.state = 2
                        self.goal_callback()

                        for i in range(17):
                            print("target 검사")
                            print("{}번째 data: ".format(i), datas[i]["state"])
                            print(datas)
                            print("\n")
                            print("전체 앱 상태: ", self.app_status_msg.data)
                            if datas[i]["state"] != self.app_status_msg.data[i]:
                                self.selected_list.append(i)
                                print(self.selected_list)
                    else:
                        print("가전 정보가 들어오지 않음")
        if self.selected_list: # 목표 가전이 있는 경우
            if self.flag == False:
                idx = self.selected_list.pop()
                self.flag = True
                print(idx)
                print(datas)
                self.point = [datas[idx]["x"], datas[idx]["y"]]
                self.target = datas[idx]["idx"]
                self.state = datas[idx]["state"]
                self.goal_callback()
        else:
            print("제어할 가전이 없습니다.")

        if not self.path_exists: # 거의 도착 했으면
            print("도착")
            # 한 바퀴 회전하며 마주보는 순간에 동작해야 함.
            if self.is_app_status: # 앱 정보가 들어오고 있을 때
                print("앱 정보 들어옴")
                print(self.target)
                self.app_control_msg.data[self.target] = self.state
                print("앱 상태: ", self.app_status_msg.data)
                print("제어: ", self.state)
                if self.app_status_msg.data[self.target] != self.state:
                    
                    # 회전하면서
                    self.cmd_msg.angular.z=0.3
                    self.cmd_pub.publish(self.cmd_msg)
                    self.app_control_pub.publish(self.app_control_msg)
                    print("가전 상태: ", self.app_status_msg.data)
                    print("가전 제어: ", self.app_control_msg.data)
                else:
                    # 다음 인덱스 확인하기
                    self.flag = False
                    if len(self.selected_list) == 0:
                        print("가전 제어 완료!")



def main(args=None):
    rclpy.init(args=args)

    global_planner = appliance_control()
    rclpy.spin(global_planner)
    global_planner.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()