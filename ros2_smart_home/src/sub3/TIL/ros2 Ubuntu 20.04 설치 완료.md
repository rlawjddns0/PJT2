# ros2 Ubuntu 20.04 설치 완료

공식문서

https://docs.ros.org/en/foxy/Installation/Ubuntu-Install-Binary.html



참고

https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=seongcheol02&logNo=221677325965

https://snowdeer.github.io/ros2/2020/09/14/how-to-install-ros2-foxy-using-apt/



**주의**

- 명세서에 따라 ros eloquent로 작업했지만 우리 서버 우분투 버전이 20.04라서 ros eloquent는 설치할 수 없었고, ros foxy를 설치했다.
- 더 최신 버전이라 오히려 좋은듯?



**에러**

```
...
Unpacking usb-modeswitch-data (20191128-3) ...
Selecting previously unselected package usb-modeswitch.
Preparing to unpack .../884-usb-modeswitch_2.5.2+repack0-2ubuntu3_amd64.deb ...
Unpacking usb-modeswitch (2.5.2+repack0-2ubuntu3) ...
Errors were encountered while processing:
 /tmp/apt-dpkg-install-42nv4Z/600-python3-rospkg-modules_1.3.0-1_all.deb
 /tmp/apt-dpkg-install-42nv4Z/601-python3-rosdistro-modules_0.8.3-1_all.deb
E: Sub-process /usr/bin/dpkg returned an error code (1)
```

설치 도중 이런 에러 다수 발생

*sudo apt --fix-broken install* 한번 하고

https://devji.tistory.com/entry/TroubleShooting-python3-rospkg-modules-%EC%84%A4%EC%B9%98-%EC%97%90%EB%9F%AC-dpkg-error-processing-archive-trying-to-ovewrite

위 링크에 써있는 방법으로 해결





windows와는 실행 명령어가 다르다. 윈도우즈에서 기능 한창 만들고 자동 실행시킬 때에는 명령어를 수정해줘야 할 것 같다.



## 명령어 차이

Windows 명령어

```
call C:\dev\ros2_eloquent\setup.bat
```

Linux 명령어

```
source /opt/ros/foxy/setup.bash
```



Windows 명령어

```
call C:\Users\multicampus\Desktop\S05P21B202\ros2_smart_home\install\local_setup.bat
```

Linux 명령어

```bash
# ros2_smart_home 경로로 이동
cd ~/jenkins_home/workspace/kjw/ros2_smart_home
# install\local_setup.bat 부분
. install/setup.bash
```



colcon build는 동일하다.

나머지 ros2 run ~ 명령어도 동일하다.



