# node.js에서 .py 실행하기

node.js에서 제공하는 child_process 라이브러리를 이용하면 .py 파일을 실행할 수 있다

```js
const { spawn } = require('child_process')

	socket.on('cleanerOnToServer', () => {
        const opt = {
            shell: true,
            cwd: 'C:/Users/multicampus/Desktop/S05P21B202/ros2_smart_home/src/sub2/sub2/'
        }
        const child = spawn('call C:/dev/ros2_eloquent/setup.bat && call C:/Users/multicampus/Desktop/S05P21B202/ros2_smart_home/install/local_setup.bat && load_map.py', opt)
        child.stderr.on('data', function (data) {
            console.error("STDERR:", data.toString());
          });
          child.stdout.on('data', function (data) {
            console.log("STDOUT:", data.toString());
          });
          child.on('exit', function (exitCode) {
            console.log("Child exited with code: " + exitCode);
          });
        
        // socket.to(roomName).emit('cleanerOn'); // 일단 소켓에 cleanerOn을 보내긴 하는데 안쓸 수도?
    })
```

서버가 연결되어 있는 소켓에 'cleanerOnToServer'라는 메시지가 뿌려지면 이에 반응하여 ros 파일을 실행하게 된다. 좀 더 살펴보면,

```js
const opt = {
    shell: true,
    cwd: 'C:/Users/multicampus/Desktop/S05P21B202/ros2_smart_home/src/sub2/sub2/'
}
```

여러 개의 명령어를 실행하기 위해서 shell 형태로 사용하려면 shell을 true로 설정해줘야 하고, cwd에는 명령이 실행되는 위치를 적어준다.

```python
const child = spawn('call C:/dev/ros2_eloquent/setup.bat && \
call C:/Users/multicampus/Desktop/S05P21B202/ros2_smart_home/install/local_setup.bat && \ load_map.py', opt)
```

spawn의 첫 번째에 들어가는 값은 명령어로, shell을 true로 설정할 것이므로 여러 개의 명령어를 &&으로 묶어줄 수 있다.

처음 두 명령어는 ros 명령어를 사용하기 위해서 cmd를 켜면 반드시 입력해야 하는 두 가지를 입력한 것이다.

마지막 명령어는 현재 위치(cwd)에서 load_map.py를 실행하기 위해 적어주었다.

- load_map.py는 파이썬 파일 그대로를 실행하는 것이므로, ros2 run load_map 을 임의 경로에서 진행해도 될 듯 하다.
- 나중에는 launch 파일을 이용할 것인데, launch는 해당 폴더에 들어가서 해야 하므로 cwd를 잘 설정해주는 것이 중요할 것이다. launch의 경우 load_map.py 대신 ros2 launch cleaning_launch.py 처럼 입력해주면 된다.



