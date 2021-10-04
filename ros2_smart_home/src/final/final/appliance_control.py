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

global des_x, des_y, target_num, target_status
des_x, des_y, target_num, target_status = 0, 0, 0, 0
@sio.on('applianceControl')
def appliance_var(data):
    global des_x, des_y, target_num, target_status
    des_x = int(data[0])
    des_y = int(data[1])
    target_num = int(data[2])
    target_status = int(data[3])
    print(des_x, des_y, target_num, target_status)

def get_global_var():
    return des_x, des_y, target_num, target_status

def reset_global_var():
    global des_x, des_y, target_num, target_status
    des_x, des_y, target_num, target_status = 0, 0, 0, 0

class appliance_control(Node):
    def __init__(self):
        super().__init__('goal_change')
        sio.connect('http://127.0.0.1:12001/')
        des_x, des_y, target_num, target_status = get_global_var()
        self.target = target_num # 목표 가전
        self.target_status = target_status # 켤지 끌지
        # 로직 1. publisher, subscriber 만들기
        time_period = 0.05
        self.point = [des_x, des_y]
        self.map_resolution=0.05
        self.map_offset_x=-8-8.75
        self.map_offset_y=-4-8.75

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
        des_x, des_y, target_num, target_status = get_global_var()
        if [des_x, des_y] == self.point and self.target == target_num and self.target_status == target_status:
            pass
        else: # 목표가 달라지면 반영하기
            self.point = [des_x, des_y]
            self.target = target_num
            self.target_status = target_status
            self.goal_callback()
        if not self.path_exists: # 거의 도착 했으면
            # 한 바퀴 회전하며 마주보는 순간에 동작해야 함.
            if self.is_app_status: # 앱 정보가 들어오고 있을 때
                self.app_control_msg.data[self.target] = self.target_status
                if self.app_status_msg.data[self.target] != self.target_status:
                    # 회전하면서
                    self.cmd_msg.angular.z=0.3
                    self.cmd_pub.publish(self.cmd_msg)
                    self.app_control_pub.publish(self.app_control_msg)
                    print("가전 상태: ", self.app_status_msg.data)
                    print("가전 제어: ", self.app_control_msg.data)
                else:
                    # 종료
                    print("종료!")


def main(args=None):
    rclpy.init(args=args)

    global_planner = appliance_control()
    rclpy.spin(global_planner)
    global_planner.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()