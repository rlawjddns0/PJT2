# Socket.io (JS)

socket.io를 이용한 통신에서 받는 코드는 on, 보내는 코드는 emit을 사용한다.



- 서버측에서 이벤트를 보낼 때는 `io.sockets.emit("이벤트명", data)`
- 서버측에서 이벤트를 받을 때는 `socket.on("이벤트명", function(data){})`
- 클라이언트측에서 이벤트를 보낼 때는 socket.emit("이벤트명", data)
- 클라이언트측에서 이벤트를 받을 때는 socket.on("이벤트명", function(data){})

