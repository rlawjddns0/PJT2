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





## 갑자기 안됨

갑자기 실행이 안됨(코드 변화x)

child_process에 대한 공식 문서를 확인해 본 결과 shell을 사용하는 경우 환경 변수가 다음과 같이 설정된다고 한다.

- [`shell`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell to execute the command with. See [Shell requirements](https://nodejs.org/api/child_process.html#child_process_shell_requirements) and [Default Windows shell](https://nodejs.org/api/child_process.html#child_process_default_windows_shell). **Default:** `'/bin/sh'` on Unix, `process.env.ComSpec` on Windows.

shell을 사용하지 않을 때의 환경 변수는 env <Object> Environment key-value pairs. Default: process.env.

라고 써있다..

 환경 변수를 다음과 같이 설정한 결과 실행은 되었으나 rqt나 rviz에 실행 결과가 반영되지 않는다.

```js
        const opt = {
            cwd: '../ros2_smart_home/src/sub2',
            shell: true,
            env: {
                PATH: process.env.PATH
            },
        }
```



잘 되던게 갑자기 실행이 안되는 원인은 환경 변수 때문이라고 쳐도 왜 실행을 했는데도 rviz나 rqt에 반영이 되지 않는걸까? 진짜 모르겠다.
