import numpy as np
import cv2
import os
import rclpy
import socketio
import base64

from rclpy.node import Node
from geometry_msgs.msg import Twist,Point
from ssafy_msgs.msg import TurtlebotStatus
from sensor_msgs.msg import CompressedImage
from std_msgs.msg import Float32,Int8MultiArray
from squaternion import Quaternion
from nav_msgs.msg import Odometry,Path
import geometry_msgs.msg
from math import pi,cos,sin,sqrt,atan2
import tf2_ros

sio = socketio.Client()

global auto_switch
auto_switch=0

global m_control_cmd
m_control_cmd=0

@sio.event
def connect():
    print('connection established')

@sio.event
def disconnect():
    print('disconnected from server')    

# cmd_vel 제어
# left = 1, go = 2, right = 3
@sio.on('turnleft')
def turn_left(data):
    global m_control_cmd
    m_control_cmd = data

@sio.on('gostraight')
def turn_left(data):
    global m_control_cmd
    m_control_cmd = data

@sio.on('turnright')
def turn_right(data):
    global m_control_cmd
    m_control_cmd = data

@sio.on('appliancesChangeToServer')
def appliancesChangeToServer(data):
    global m_control_cmd
    m_control_cmd = data

def get_global_var():
    return m_control_cmd, auto_switch

def reset_global_var():
    global m_control_cmd
    m_control_cmd = 0


class Control_hub(Node):

    def __init__(self):
        super().__init__('Control_hub')

        self.cmd_publisher = self.create_publisher(Twist, 'cmd_vel', 10)

        self.cmd_msg=Twist()
        self.timer_period = 0.05
        self.timer = self.create_timer(self.timer_period, self.timer_callback)

        # server와 연결
        # sio.connect('http://j5b202.p.ssafy.io:12001/')
        sio.connect('http://127.0.0.1:12001/')

        self.m_control_interval = 10
        self.m_control_iter = 0
        self.m_control_mode = 0
        self.lfd=0.1


    def turtlebot_go(self) :
        self.cmd_msg.linear.x=0.2
        self.cmd_msg.angular.z=0.0

    def turtlebot_stop(self) :
        self.cmd_msg.linear.x=0.0
        self.cmd_msg.angular.z=0.0

    def turtlebot_cw_rot(self) :
        self.cmd_msg.linear.x=0.0
        self.cmd_msg.angular.z=0.2

    def turtlebot_cww_rot(self) :
        self.cmd_msg.linear.x=0.0
        self.cmd_msg.angular.z=-0.2
        
    def timer_callback(self):
        ctrl_cmd, auto_switch = get_global_var()

        # auto patrol mode off
        sio.emit('PatrolStatus', 'Off')
        # turn left
        if ctrl_cmd == 1:
            self.turtlebot_cww_rot()
        # go straight
        elif ctrl_cmd == 2:
            self.turtlebot_go()
        # turn right
        elif ctrl_cmd == 3:
            self.turtlebot_cw_rot()
        else:
            self.turtlebot_stop()

        self.cmd_publisher.publish(self.cmd_msg)

        # 계속 움직이는게 아니라 조작을 안하면 멈춰야하므로
        if ctrl_cmd!=0: 
            self.m_control_iter += 1

        if self.m_control_iter % self.m_control_interval == 0:
            self.m_control_iter = 0
            reset_global_var()



def main(args=None):
    
    rclpy.init(args=args)

    control_hub = Control_hub()

    rclpy.spin(control_hub)
    
    rclpy.shutdown()

    sio.disconnect()


if __name__ == '__main__':
    main()

