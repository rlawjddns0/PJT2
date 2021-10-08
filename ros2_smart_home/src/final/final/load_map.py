import rclpy
import numpy as np
from rclpy.node import Node
import os
from geometry_msgs.msg import Pose
from squaternion import Quaternion
from nav_msgs.msg import Odometry,OccupancyGrid,MapMetaData
from math import pi

# load_map 노드는 맵 데이터를 읽어서, 맵 상에서 점유영역(장애물) 근처에 로봇이 움직일 수 없는 영역을 설정하고 맵 데이터로 publish 해주는 노드입니다.
# 추 후 a_star 알고리즘에서 맵 데이터를 subscribe 해서 사용합니다.

# 노드 로직 순서
# 1. 맵 파라미터 설정
# 2. 맵 데이터 읽고, 2차원 행렬로 변환
# 3. 점유영역 근처 필터처리

class loadMap(Node):

    def __init__(self):
        super().__init__('load_map')
        # map publish하기
        self.map_pub = self.create_publisher(OccupancyGrid, 'map', 1)
        
        time_period=1  
        self.timer = self.create_timer(time_period, self.timer_callback)
       
        # 로직 1. 맵 파라미터 설정
        # 제공한 맵 데이터의 파라미터입니다. size_x,y는 x,y 방향으로 grid의 개수이고, resolution은 grid 하나당 0.05m라는 것을 의미합니다.
        # offset_x,y 의 -8, -4 는 맵 데이터가 기준 좌표계(map)로 부터 떨어진 거리를 의미합니다. 
        # 각 항에 -8.75를 뺀이유는 ros에서 occupancygrid의 offset이라는 데이터는 맵의 중앙에서 기준좌표계까지 거리가 아니라 맵의 우측하단에서 부터 기준좌표계까지의 거리를 의미합니다.
        # 따라서 (350*0.05)/2를 해준 값을 빼줍니다.
        self.map_msg=OccupancyGrid()
        self.map_size_x=350 
        self.map_size_y=350
        self.map_resolution=0.05
        self.map_offset_x=-16.75 # -8-8.75 # -16.75
        self.map_offset_y=-12.75 # -4-8.75 # -12.75
        self.map_data = [0 for i in range(self.map_size_x*self.map_size_y)]
        grid=np.array(self.map_data) # 350*350 길이의 일차원 array 만들기
        grid=np.reshape(grid,(350, 350)) # row 350, col 350의 이차원 array 만들기

        self.map_msg.header.frame_id="map"

   

        m = MapMetaData() # 그리드 맵을 그리기 위한 요소들을 저장 가능
        m.resolution = self.map_resolution # 0.05
        m.width = self.map_size_x # 350
        m.height = self.map_size_y # 350
        m.origin = Pose()
        m.origin.position.x = self.map_offset_x
        m.origin.position.y = self.map_offset_y

        self.map_meta_data = m
        self.map_msg.info=self.map_meta_data
        
        # 로직 2. 맵 데이터 읽고, 2차원 행렬로 변환
        # pkg_path =os.getcwd()
        # back_folder='..'
        # folder_name='map'
        # file_name='map.txt'
        # full_path=os.path.join(pkg_path,back_folder,folder_name,file_name)
        # smarthome1의 맵 데이터 경로
        full_path = 'C:\\Users\\multicampus\\Desktop\\backend\\S05P21B202\\ros2_smart_home\\src\\final\\map\\map.txt'
        self.f = open(full_path, 'r')
        # map에는 데이터가 한 줄로 저장되어 있음 (열어보면 여러 줄로 보이지만 한 줄임)
        line = self.f.readline().split() # map 데이터 한 줄로 모두 읽어옴(str)
        line_data = list(map(int, line)) # 데이터 int로 모두 바꿈
        
        for num, data in enumerate(line_data) :
            self.map_data[num] = data

        map_to_grid = np.array(self.map_data) # array로 만들기
        grid = np.reshape(map_to_grid, (350, 350)) # 350 * 350 행렬로 변환시켜 저장
        # grid = np.reshape(line_data, (350, 350))

        # 색칠하기
        for x in range(350):
            for y in range(350):
                if grid[x][y] == 100:
                    # 로직 3. 점유영역 근처 필터처리
                    for i in range(y-5, y+5):
                        if i >= 350: i = 349
                        if i <= 0: i = 0
                        
                        if grid[x][i] != 100:
                            grid[x][i] = 127
                        for j in range(x-5, x+5):
                            if j >= 350: j = 349
                            if j <= 0: j = 0
                            if grid[j][i] != 100:
                                grid[j][i] = 127

        
        np_map_data=grid.reshape(1,350*350) # 다시 한 줄로 만들기
        list_map_data=np_map_data.tolist()
   
   
        ## 로직2를 완성하고 주석을 해제 시켜주세요.
        self.f.close()
        print('read_complete')
        self.map_msg.data=list_map_data[0]


    def timer_callback(self):
        self.map_msg.header.stamp =rclpy.clock.Clock().now().to_msg()
        self.map_pub.publish(self.map_msg)


       
def main(args=None):
    rclpy.init(args=args)

    load_map = loadMap()
    rclpy.spin(load_map)
    load_map.destroy_node()
    rclpy.shutdown()



if __name__ == '__main__':
    main()