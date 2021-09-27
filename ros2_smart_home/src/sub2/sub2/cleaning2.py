
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Pose,PoseStamped

from nav_msgs.msg import Odometry,OccupancyGrid,MapMetaData,Path
import numpy as np
import time

class cleaning(Node):
    def __init__(self):
        super().__init__('cleaning')
        self.goal_pub = self.create_publisher(PoseStamped, 'goal_pose', 10)
        # 맵 받아오기(이동 가능한 영역인지 확인하기 위함)
        self.map_msg=OccupancyGrid()
        self.is_map = False
        self.is_grid_update = False

        # 맵과 남은 경로 받아오기
        self.map_sub = self.create_subscription(OccupancyGrid,'map', self.map_callback,1)
        self.path_sub = self.create_subscription(Path,'/local_path',self.path_callback,10)
        self.path_exists = False
        time_period = 0.05
        self.point = [0, 0]
        self.i = 0
        self.j = 0
        self.map_resolution=0.05
        self.map_offset_x=-8-8.75
        self.map_offset_y=-4-8.75
        
        self.timer = self.create_timer(time_period, self.timer_callback)

    def map_callback(self,msg):
        self.is_map = True
        self.map_msg=msg

    def path_callback(self, msg):
        # 더 이상 경로가 없을 때
        self.path_msg=msg
        if len(self.path_msg.poses) < 3:
            self.path_exists = False
        else:
            self.path_exists = True
        
        # 임시 확인용
        print(len(self.path_msg.poses))

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

    def timer_callback(self):
        if self.is_map == True:
            if self.is_grid_update == False:
                # grid 맵 가져오기
                self.grid_update()
                print("map 가져오기 완료")
                flag = False
                for i in range(0, 350):
                    if flag:
                        break
                    for j in range(0, 350):
                        # 처음으로 갈 수 있는 지점
                        if self.grid[i][j] == 0:
                            self.point[0] = i
                            self.point[1] = j
                            self.i = i
                            self.j = j
                            flag = True
                            break
                

        # 경로가 없을 때 새로운 경로를 찍을 것이다.
        if self.is_grid_update:
            if self.path_exists == False:
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
                    print("1초 딜레이")
                    time.sleep(3)
                else:
                    print(self.point[0], self.point[1])
                    print("이동 가능한 위치가 아닙니다.")
                # 다음 입력할 위치 선정
                self.j += 5
                if self.j >= 350: # j를 다 해봤으면
                    # i 변경
                    self.i += 5
                    self.j = 0
                if self.i >= 350:
                    print("모두 청소 완료!")
                    global_planner.destroy_node()
                    rclpy.shutdown()

def main(args=None):
    rclpy.init(args=args)

    global_planner = cleaning()
    rclpy.spin(global_planner)


    global_planner.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()