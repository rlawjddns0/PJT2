import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Pose,PoseStamped

class goal_change(Node):

    def __init__(self, des_x, des_y):
        super().__init__('goal_change')
        # 로직 1. publisher, subscriber 만들기
        time_period = 0.5
        self.point = [des_x, des_y]
        self.map_resolution=0.05
        self.map_offset_x=-8-8.75
        self.map_offset_y=-4-8.75
        self.goal_pub = self.create_publisher(PoseStamped, 'goal_pose', 10)
        self.goal_callback()

    def grid_cell_to_pose(self,grid_cell):

        # 로직 5. map의 grid cell을 위치(x,y)로 변환
        x=(grid_cell[0] * self.map_resolution) + self.map_offset_x
        y=(grid_cell[1] * self.map_resolution) + self.map_offset_y
        return [x,y]

    def goal_callback(self):

        # self.goal_sub = self.create_subscription(PoseStamped,'goal_pose',self.goal_callback,1)
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



def main(args=None):
    rclpy.init(args=args)

    global_planner = goal_change()
    rclpy.spin(global_planner)


    global_planner.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()