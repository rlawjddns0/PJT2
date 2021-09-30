# socketio (Python)

https://python-socketio.readthedocs.io/en/latest/



## 1. socketio.Client()

keyword parameter들이 많다.

- reconnection
  - True: 서버와의 연결이 끊기면 자동으로 재연결 시도, default
  - False: 재연결 시도하지 않음
- reconnection_attempts
  - 재연결 시도 횟수
  - default값은 0으로, 0은 무한히 재시도한다.
  - reconnection