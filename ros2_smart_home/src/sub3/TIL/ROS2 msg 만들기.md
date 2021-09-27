# ROS2 msg 만들기

1. 경로 src/ssafy_msgs/msg/ 에 들어간다.

2. .msg 파일을 만든다.

3. 내용을 입력한다.

   ```
   //ex) ObjectXY.msg
   
   float32 x_distance
   float32 y_distance
   ```

4. src/ssafy_msgs/CMakeLists.txt 에서 다음 부분 수정

   ```cmake
   rosidl_generate_interfaces(${PROJECT_NAME}
     "msg/Num.msg"
   	...
     "msg/CustomObjectInfo.msg"
     "msg/ObjectXY.msg"                                 <-- 추가한 것
     DEPENDENCIES std_msgs geometry_msgs
    )
   ```

5. package.xml 에서 다음 부분이 없으면 추가하기

   ```xml
     <build_depend>rosidl_default_generators</build_depend>
     <exec_depend>rosidl_default_runtime</exec_depend>
     <member_of_group>rosidl_interface_packages</member_of_group>
   ```

6. 변경한 패키지 build

