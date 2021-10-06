const bodyParser=require('body-parser');
const path=require('path');
const bcrypt=require('bcrypt')
const DB=require('./config/DBconfig')
const saltRounds=10
const express = require('express');
const router=require('./router/index')
const schedule=require('node-schedule')
const {spawn}=require('child_process')

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
const { start } = require('repl');

// 로직 2. 포트번호 지정
const port = process.env.port || 12001

var startMode
var endMode


//controller
//############################# api 시작~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.use(router)

//########################## 3api 끝~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




server.listen(port,()=>console.log(`app starting on port ${port}...`))

const roomName = 'team';




//##############################소켓 연결 후#################################
//실행
io.on('connection', socket => {
    console.log("소켓 참여~")
    socket.join(roomName);

    // 에어컨 켜기
    socket.on('livingroomairOnToServer', ()=>{
        data = [192, 225, 10, 1]
        socket.to(roomName).emit('applianceControl', data);
    })
    // 에어컨 끄기
    socket.on('livingroomairOffToServer', ()=>{
        data = [192, 225, 10, 2]
        socket.to(roomName).emit('applianceControl', data);
    })
    // 방1 불 켜기
    socket.on('light1OnToServer', ()=>{
        data = [70, 153, 1, 1]
        socket.to(roomName).emit('applianceControl', data);
    })
    // 방1 불 끄기
    socket.on('light1OffToServer', ()=>{
        data = [70, 153, 1, 2]
        socket.to(roomName).emit('applianceControl', data);
    })
    // 방2 전등 ON
    //방2 전등 OFF
    //방3 전등 ON
    //방3 전등 OFF
    //방4 전등 ON
    //방4 전등 OFF
    //주방 조명 ON
    //주방 조명 OFF
    //거실 조명 ON
    //거실 조명 OFF
    //방1 에어컨 ON
    //방1 에어컨 OFF
    //방2 에어컨 ON
    //방2 에어컨 OFF
    //방3 에어컨 ON
    //방3 에어컨 OFF
    //거실 에어컨 ON
    //거실 에어컨 OFF
    //공기 청정기 ON
    //공기 청정기 OFF
    //TV ON
    //TV OFF
    //방1 커튼 ON
    //방1 커튼 OFF
    //방2 커튼 ON
    //방2 커튼 OFF
    //방3 커튼 ON
    //방3 커튼 OFF
    //거실 커튼 ON
    //거실 커튼 OFF



    // 청소 관련
    socket.on('cleanerOnToServer', ()=>{
        // data = mode, x_min, x_max, y_min, y_max
        data = [1, 0, 350, 0, 350]
        socket.to(roomName).emit('cleanerControl', data);
    })
    socket.on('room1CleanerOnToServer', ()=>{
        data = [2, 44, 105, 150, 210]
        socket.to(roomName).emit('cleanerControl', data);
    })
    socket.on('room2CleanerOnToServer', ()=>{
        data = [3, 230, 255, 144, 195]
        socket.to(roomName).emit('cleanerControl', data);
    })
    socket.on('room3CleanerOnToServer', ()=>{
        data = [4, 280, 330, 143, 200]
        socket.to(roomName).emit('cleanerControl', data);
    })
    socket.on('room4CleanerOnToServer', ()=>{
        data = [5, 80, 122, 46, 100]
        socket.to(roomName).emit('cleanerControl', data);
    })
    socket.on('livingroomCleanerOnToServer', ()=>{
        data = [6, 130, 205, 120, 240]
        socket.to(roomName).emit('cleanerControl', data);
    })
    socket.on('kitchenCleanerOnToServer', ()=>{
        data = [7, 142, 210, 43, 110]
        socket.to(roomName).emit('cleanerControl', data);
    })
    socket.on('CleanerOffToServer', ()=>{
        data = [0, 0, 0, 0, 0]
        socket.to(roomName).emit('cleanerControl', data);
    })


    socket.on('sendTime',(message)=>{
        socket.to(roomName).emit('sendTimeToWeb',message);
    })
    socket.on('sendWeather',(message)=>{
        socket.to(roomName).emit('sendWeaterToWeb',message);
    })

    socket.on('sendTemperature',(message)=>{
        socket.on(roomName).emit('sendTemperatureToWeb',message)
    })

    socket.on('sendAirConditioner',(message)=>{
        socket.on(roomName).emit('sendAriConditionerToWeb',message)
    })

    // 로직 3. 사용자의 메시지 수신시 WebClient로 메시지 전달
    socket.on('safety_status', (message) => {
        socket.to(roomName).emit('sendSafetyStatus', message);
    });

    // socket.on('PatrolStatus', (message) => {
    //     //패트롤 상태 앱으로 보내기
    //     socket.to(roomName).emit('sendPatrolStatus', message);
    // });

    // socket.on('airconOnToServer',(message)=>{
    //     socket.to(roomName).emit('sendAirConOn', "sdfsfd");
    // })

    socket.on('PatrolOnToServer', (data) => {
        //security service on~~
        socket.to(roomName).emit('patrolOn',)

        //패트롤 작동한다고 다시 메시지 보내기~
        socket.to(roomName).emit('sendPatrolStatus', "시큐리티 서비스 작동");
        console.log('Patrol On!');
    });

    socket.on('PatrolOffToServer', (data) => {
        //security service off~
        socket.to(roomName).emit('patrolOff', data);
        socket.broadcast.emit('sendPatrolStatus', "dsdfsdssfsfdsfs");
        
        //패트롤 작동한다고 다시 메시지 보내기~
        socket.emit('sendPatrolStatus', "시큐리티 서비스 중지");
        console.log('Patrol Off!');
    });

    socket.on('turnleftToServer', (data) => {
        //터틀봇 왼쪽으로 회전
        socket.to(roomName).emit('turnleft', data);

    });

    socket.on('gostraightToServer', (data) => {
        //터틀봇 앞으로 전진
        socket.to(roomName).emit('gostraight', data);
    });

    socket.on('turnrightToServer', (data) => {
        //터틀봇 오른쪽으로 회전
        socket.to(roomName).emit('turnright', data);
    });

    //터틀봇에서 소지품 찾았다고 연락이 온다~
    socket.on('findBelongingsToServer',(data)=>{
        

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

        //먼저 애플리케이션에 알람 보내고~
        socket.to(roomName).emit('alert',"분실물 발견")

    })

    //침입자 발견시
    socket.on('findIntruderToServer',(data)=>{
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
    //모드가 시작된다고 온다.~
    socket.on('modeOnToServer',(data)=>{
        console.log(data)
        //어떤 모드인지 앱에서 온 데이터를 가지고 뽑아내기
        const mode_no=data.mode_no
        const user_no=data.user_no
        

        //현재 실행상태 모드 수정
        DB.query('update current_mode set mode_no=? where user_no=?',[mode_no,user_no],(err,data)=>{
            if(err){
                console.log(err)
            }
        })


        //모드 번호로 저장된 모드 정보 가져오기
        const sql='select * from mode where no=?'
        DB.query(sql,[mode_no],(err,data)=>{
            if(err){
                console.log(err)
            }else if(data.length!=0){
                var time=data[0].time
                var day=data[0].day
                var startH=0
                var startM=0
                var endH=0
                var endM=0

                if(time[0]!='0'){
                    startH=parseInt(time.substring(0,2))
                }else if(time[0]=='0'){
                    startH=parseInt(time[1])
                }

                if(time[2]!='0'){
                    startM=parseInt(time.substring(2,4))
                }else if(time[2]=='0'){
                    startM=parseInt(time[3])
                }

                if(time[4]!='0'){
                    endH=parseInt(time.substring(4,6))
                }else if(time[4]=='0'){
                    endH=parseInt(time[5])
                }

                if(time[6]!='0'){
                    endM=parseInt(time.substring(6))
                }else if(time[6]=='0'){
                    endM=parseInt(time[7])
                }

                //일정 시간마다 스케쥴링
                //키는 시간
                startMode = schedule.scheduleJob(startM+' '+startH+' * * '+day, function(){
                    socket.to(roomName).emit('modeStart',data[0].iot)
                });
                //끄는 시간
                endMode = schedule.scheduleJob(endM+' '+endH+' * * '+day, function(){
                    socket.to(roomName).emit('modeStop',data[0].iot)
                });

            }else{
                console.log("저장된 모드 없음")
            }
        })

        

    })
    //모드 종료
    socket.on('modeOffToServer',(data)=>{
        startMode.cancel()
        endMode.cancel()
        const user_no=data.user_no
        const mode_no=data.mode_no
        DB.query('update current_mode set mode_no=? where user_no=?',[null,user_no],(err,data)=>{
            if(err){
                console.log(err)
            }
        })
        socket.to(roomName).emit('modeOff',data[0].iot)

    })


})