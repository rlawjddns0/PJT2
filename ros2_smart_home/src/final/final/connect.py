import socketio
import subprocess
import os
sio = socketio.Client()



@sio.event
def connect():
    print('connection established')




    # 로직 2. 데이터 수신 콜백함수
@sio.on('appliancesChange')
def aircon_on(data):
    print('message received with ', data)
    os.system("call C:\\dev\\ros2_eloquent\\setup.bat; call C:\\Users\\multicampus\\Desktop\\Backend\\S05P21B202\\ros2_smart_home\\install\\local_setup.bat; C:\\Users\\multicampus\\Desktop\\Backend\\S05P21B202\\ros2_smart_home\\src\\final\\final\\odom.py")
    # os.system(" ros2 launch ..\\final\\launch\\appliances_change_launch.py")
    # os.system("")
    # os.system("ros2 launch ..\\final\\launch\\appliances_change_launch.py")


@sio.on('sendAirConOff')
def aircon_off(data):
    print('message received with ', data)


@sio.event
def disconnect():
    print('disconnected from server')



# 로직 3. 서버 연결
sio.connect('http://j5b202.p.ssafy.io:12001/')

# 로직 4. 데이터 송신
sio.emit('sendTime','TEST')

sio.wait()