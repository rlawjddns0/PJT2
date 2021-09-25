const bodyParser=require('body-parser');
const path=require('path');
const bcrypt=require('bcrypt')
const DB=require('./config/DBconfig')
const saltRounds=10
const express = require('express');
const user=require('./router/user')
const mode=require('./router/mode')
const intruders=require('./router/intruders')
const belongings=require('./router/belongings')
// Websocket 서버 구동을 위한 서버 코드입니다.

// 노드 로직 순서


// client 경로의 폴더를 지정해줍니다.
const publicPath = path.join(__dirname, "/../client");
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}));

const picPath = path.join(__dirname, "/../client");

//정적인 파일은 publicPath안에 넣어두면 사용자에게 보여줄수 있다.
app.use(express.static(publicPath));

// 로직 1. WebSocket 서버, WebClient 통신 규약 정의
const server = require('http').createServer(app);
const io = require('socket.io')(server)


var fs = require('fs'); // required for file serving
const { application } = require('express');

// 로직 2. 포트번호 지정
const port = process.env.port || 12001


//############################# api 시작~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.use('/api/user',user)
app.use('/api/belongings',belongings)
app.use('/api/mode',mode)
app.use('/api/intruders',intruders)
//########################## 3api 끝~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




server.listen(port,()=>console.log(`app starting on port ${port}...`))

const roomName = 'team';




//##############################소켓 연결 후#################################
//연결 버튼 누르면
io.on('connection', socket => {
    socket.join(roomName);

    // 로직 3. 사용자의 메시지 수신시 WebClient로 메시지 전달
    socket.on('safety_status', (message) => {
        socket.to(roomName).emit('sendSafetyStatus', message);
    });

    socket.on('PatrolStatus', (message) => {
        //패트롤 상태 앱으로 보내기
        socket.to(roomName).emit('sendPatrolStatus', message);
    });

    socket.on('PatrolOnToServer', (data) => {
        //security service on~~
        socket.to(roomName).emit('patrolOn')

        //패트롤 작동한다고 다시 메시지 보내기~
        socket.emit('sendPatrolStatus', "시큐리티 서비스 작동");
        console.log('Patrol On!');
    });

    socket.on('PatrolOffToServer', (data) => {
        //security service off~
        socket.to(roomName).emit('patrolOff', data);

        
        //패트롤 작동한다고 다시 메시지 보내기~
        socket.emit('sendPatrolStatus', "시큐리티 서비스 중지");
        console.log('Patrol Off!');
    });

    socket.on('turnleftToServer', (data) => {
        //터틀봇 왼쪽으로 회전~
        socket.to(roomName).emit('turnleft', data);

    });

    socket.on('gostraightToServer', (data) => {
        //터틀봇 앞으로 전진~
        socket.to(roomName).emit('gostraight', data);
    });

    socket.on('turnrightToServer', (data) => {
        //터틀봇 오른쪽으로 회전~
        socket.to(roomName).emit('turnright', data);
    });

    socket.on('airconOnToServer', (data) => {
        console.log("어플리케이션에서 에어컨 키라고 명령이 왔다")

        //터틀봇에 에어컨 키라고 명령 보내고
        socket.to(roomName).emit('airconOn', data);


        //임시로 에어컨 켰다는 메시지 다시 클라이언트로 보내기
        socket.emit('sendSafetyStatus',"에어컨을 켰습니다.")
    });


    socket.on('airconOffToServer', (data) => {
        console.log("어플리케이션에서 에어컨 끄라고 명령이 왔다")
        socket.to(roomName).emit('airconOff', data);

        //임시로 에어컨 껐다는 메시지 다시 클라이언트로 보내기
        socket.emit('sendSafetyStatus',"에어컨을 켰습니다.")
    });


    socket.on('Light1OnToServer', (data) => {
        console.log("어플리케이션에서 불1 키라고 명령이 왔다")

        //불1 키라고 터틀봇에 명령 내리기~
        socket.to(roomName).emit('Light1On', data);
    });


    socket.on('Light1OffToServer', (data) => {
        console.log("어플리케이션에서 불1 끄라고 명령이 왔다")

        //불1 끄라고 터틀봇에 명령 내리기~
        socket.to(roomName).emit('Light1Off', data);
        
    });


    socket.on('Light2OnToServer', (data) => {
        console.log("어플리케이션에서 불2 키라고 명령이 왔다")
        //터틀봇에 불2 키라고 명령 보내기
        socket.to(roomName).emit('Light2On', data);
    });


    socket.on('Light2OffToServer', (data) => {
        console.log("어플리케이션에서 불2 키라고 명령이 왔다")
        //터틀봇에 불2 끄라고 명령 보내기~
        socket.to(roomName).emit('Light2Off', data);
    });




    socket.on('disconnect', () => {
        console.log('disconnected from server 111');
        socket.disconnect();
    });

    // 전달받은 이미지를 jpg 파일로 저장
    socket.on('streaming', (message) => {
        socket.to(roomName).emit('sendStreaming', message);
        // console.log(message);
        buffer = Buffer.from(message, "base64");
        fs.writeFileSync(path.join(picPath, "/../client/cam.jpg"), buffer);
    });


    socket.on('findBelongings',(data)=>{
        //먼저 애플리케이션에 알람 보내고~
        socket.to(roomName).emit('alert',"분실물 발견")

        //디비에 저장
        console.log("터틀봇에게 분실물 찾았다고 왔다~~")
        const type=data.type
        const user_no=data.user_no
        const photo=data.photo
        const flag=false
        const datetime=data.datetime
        const sql='insert into belongings(type,user_no,photo,flag,datetime) values(?,?,?,?,?)'
        const param=[type,user_no,photo,flag,datetime]
        DB.query(sql,param,(err,data)=>{
            if(err){
                console.log(err)
            }
        })

    })

    //침입자 발견시
    socket.on('findIntruder',(data)=>{
        //먼저 애플리케이션에 알람 보내고~
        socket.to(roomName).emit('alert',"침입자 발견")
        const user_no=data.user_no
        const photo=data.photo
        const datetime=data.datetime
        const sql='insert into intruders(user_no,photo,datetime) values(?,?,?)'
        const param=[user_no,photo,datetime]
        DB.query(sql,param,(err,data)=>{
            if(err){
                console.log(err)
            }
        })

    })

    socket.on('modeOnToServer',(data)=>{
        
        //어떤 모드인지 앱에서 온 데이터를 가지고 뽑아내기
        const mode=data.mode

        //모드 번호로 저장된 모드 정보 가져오기
        const sql='select * from mode where no=?'
        
        DB.query(sql,mode,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                
            }
        })

        

    })


})