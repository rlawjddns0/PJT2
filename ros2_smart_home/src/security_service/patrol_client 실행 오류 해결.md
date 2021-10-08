patrol_client 실행 오류 해결

1. socket.Client()를 못 찾음

   - pip install python-socketio 설치
   - https://github.com/miguelgrinberg/python-socketio/issues/264

2. OPEN Packet not returned by the server

   - ```js
     pip install python-engineio==3.14.2 python-socketio==4.6.0
     ```

   - https://stackoverflow.com/questions/66809068/python-socketio-open-packet-not-returned-by-the-server

