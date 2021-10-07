const bodyParser=require('body-parser');
const path=require('path');
const bcrypt=require('bcrypt')
const DB=require('./config/DBconfig')
const saltRounds=10
const express = require('express');
const router=require('./router/index')
const schedule=require('node-schedule')
const AWS = require('aws-sdk');
const S3_ID = "AKIAXNNAAPAAH7JCPOPR";
const SECRET = "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"
const s3 = new AWS.S3({
    accessKeyId: S3_ID,
    secretAccessKey: SECRET
});

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


    // 알람
    socket.on('alertToServer', (data) => {
        console.log("알람 받음")
        socket.to(roomName).emit('alertToApp', data);
    })

    //거실 에어컨 켜기
    socket.on('livingroomairOnToServer', ()=>{
        const sql="select * from appliances where idx=10"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=10',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
        
    })
    //거실 에어컨 끄기
    socket.on('livingroomairOffToServer', ()=>{
        const sql="select * from appliances where idx=10"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=10',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
        
    })
    // 방1 불 켜기
    socket.on('light1OnToServer', ()=>{
        const sql="select * from appliances where idx=7"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=7',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })
    // 방1 불 끄기
    socket.on('light1OffToServer', ()=>{
        const sql="select * from appliances where idx=7"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=7',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    // 방2 전등 ON
    socket.on('light2OnToServer', ()=>{
        const sql="select * from appliances where idx=2"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=2',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방2 전등 OFF
    socket.on('light1OffToServer', ()=>{
        const sql="select * from appliances where idx=2"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=2',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방3 전등 ON
    socket.on('light3OnToServer', ()=>{
        const sql="select * from appliances where idx=3"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=3',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방3 전등 OFF
    socket.on('light3OnToServer', ()=>{
        const sql="select * from appliances where idx=3"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=3',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방4 전등 ON
    socket.on('light4OnToServer', ()=>{
        const sql="select * from appliances where idx=4"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=4',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방4 전등 OFF
    socket.on('light4OnToServer', ()=>{
        const sql="select * from appliances where idx=4"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=4',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //주방 조명 ON
    socket.on('kitchenOnToServer', ()=>{
        const sql="select * from appliances where idx=5"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=5',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //주방 조명 OFF
    socket.on('kitchenOffToServer', ()=>{
        const sql="select * from appliances where idx=5"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=5',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })


    //거실 조명 ON
    socket.on('livingroomOnToServer', (data)=>{
        const sql="select * from appliances where idx=6"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=6',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //거실 조명 OFF
    socket.on('livingroomOnToServer', ()=>{
        const sql="select * from appliances where idx=6"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=6',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방1 에어컨 ON
    socket.on('room1airOnToServer', (data)=>{
        const sql="select * from appliances where idx=7"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=7',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방1 에어컨 OFF
    socket.on('room1airOnToServer', ()=>{
        const sql="select * from appliances where idx=7"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=7',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방2 에어컨 ON
    socket.on('room2airOnToServer', (data)=>{
        const sql="select * from appliances where idx=8"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=8',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })


    //방2 에어컨 OFF
    socket.on('room2airOnToServer', ()=>{
        const sql="select * from appliances where idx=8"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=8',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })


    //방3 에어컨 ON
    socket.on('room3airOnToServer', (data)=>{
        const sql="select * from appliances where idx=9"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=9',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })


    //방3 에어컨 OFF
    socket.on('room3airOnToServer', ()=>{
        const sql="select * from appliances where idx=9"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=9',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })


    //공기 청정기 ON
    socket.on('purifierOnToServer', (data)=>{
        const sql="select * from appliances where idx=10"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=10',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //공기 청정기 OFF
    socket.on('purifierOffToServer', ()=>{
        const sql="select * from appliances where idx=10"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=10',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //TV ON
    socket.on('TVOnToServer', (data)=>{
        const sql="select * from appliances where idx=11"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=11',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //TV OFF
    socket.on('TVOffToServer', ()=>{
        const sql="select * from appliances where idx=11"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=11',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방1 커튼 ON
    socket.on('room1curtainOnToServer', (data)=>{
        const sql="select * from appliances where idx=12"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=12',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방1 커튼 OFF
    socket.on('room1curtainOffToServer', ()=>{
        const sql="select * from appliances where idx=12"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=12',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })
    
    //방2 커튼 ON
    socket.on('room2curtainOnToServer', (data)=>{
        const sql="select * from appliances where idx=13"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=13',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방2 커튼 OFF
    socket.on('room2curtainOffToServer', ()=>{
        const sql="select * from appliances where idx=13"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=13',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //방3 커튼 ON
    socket.on('room3curtainOnToServer', (data)=>{
        const sql="select * from appliances where idx=14"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=14',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })


    //방3 커튼 OFF
    socket.on('room3curtainOffToServer', ()=>{
        const sql="select * from appliances where idx=14"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=14',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //거실 커튼 ON
    socket.on('livingroomcurtainOnToServer', (data)=>{
        const sql="select * from appliances where idx=15"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=1
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=1 where idx=15',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    //거실 커튼 OFF
    socket.on('livingroomcurtainOffToServer', ()=>{
        const sql="select * from appliances where idx=15"
        DB.query(sql,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                data[0].state=2
                console.log(data)
                socket.to(roomName).emit('applianceControl', data);
                DB.query('update appliances set state=2 where idx=15',(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            }
        })
    })

    // 청소 관련
    socket.on('cleanerOnToServer', (msg)=>{
        // data = mode, x_min, x_max, y_min, y_max
        // data = [1, 0, 350, 0, 350]
        console.log(msg)
        DB.query('select * from clean where no=1',(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                socket.to(roomName).emit('cleanerControl', data);
            }
        })


        
    })
    socket.on('room1CleanerOnToServer', (msg)=>{
        // data = [2, 44, 105, 150, 210]
        console.log(msg)
        DB.query('select * from clean where no=2',(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                socket.to(roomName).emit('cleanerControl', data);
            }
        })
    })
    socket.on('room2CleanerOnToServer', (msg)=>{
        // data = [3, 230, 255, 144, 195]
        console.log(msg)
        DB.query('select * from clean where no=3',(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                socket.to(roomName).emit('cleanerControl', data);
            }
        })
    })
    socket.on('room3CleanerOnToServer', (msg)=>{
        // data = [4, 280, 330, 143, 200]
        console.log(msg)
        DB.query('select * from clean where no=4',(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                socket.to(roomName).emit('cleanerControl', data);
            }
        })    
    })
    socket.on('room4CleanerOnToServer', (msg)=>{
       // data = [5, 80, 122, 46, 100]
        console.log(msg)
        DB.query('select * from clean where no=5 ',(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                socket.to(roomName).emit('cleanerControl', data);
            }
        })    
    })
    socket.on('livingroomCleanerOnToServer', (msg)=>{
       // data = [6, 130, 205, 120, 240]
        console.log(msg)
        DB.query('select * from clean where no=6',(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                socket.to(roomName).emit('cleanerControl', data);
            }
        })    
    })

    socket.on('kitchenCleanerOnToServer', (msg)=>{
       // data = [7, 142, 210, 43, 110]
        console.log(msg)
        DB.query('select * from clean where no=7',(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                socket.to(roomName).emit('cleanerControl', data);
            }
        })    
    })
    socket.on('CleanerOffToServer', (msg)=>{
        //data = [0, 0, 0, 0, 0]
        console.log(msg) 
        DB.query('select * from clean where no= 0',(err,data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data)
                socket.to(roomName).emit('cleanerControl', data);
            }
        })    

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


    //터틀봇에서 소지품 찾았다고 연락이 온다~
    socket.on('findBelongingsToServer',(data_socket)=>{
        //먼저 애플리케이션에 알람 보내고~
        socket.to(roomName).emit('alertToApp',"분실물 발견")
        //디비에 저장
        console.log("터틀봇에게 분실물 찾았다고 왔다~~")
        buffer = Buffer.from(data_socket.photo, "base64");
        file_path = path.join(picPath, "./" + data_socket.datetime.replace(/:/gi, "-") +".jpg")
        fs.writeFileSync(file_path, buffer); // 이미지 파일 resource에 저장
        var Location
        const uploadFile = (path) => {
            const fileContent = fs.readFileSync(path) // 파일을 읽어서
            const params = {
                Bucket: 'ssavis',
                Key: data_socket.datetime.replace(/:/gi, "-") +".jpg",
                Body: fileContent
            }
            s3.upload(params, function(err, data) {
                if (err) {throw err;}
                console.log('File Uploaded Successfully')
                console.log(data)
                Location = data.Location
                const type=data_socket.type
                const user_no=data_socket.user_no
                const photo=Location
                const flag= true
                const datetime=data_socket.datetime
                const position=data_socket.position
                const sql='insert into belongings(type, user_no, photo, flag, datetime, position) values(?,?,?,?,?,?)'
                const param=[type, user_no, photo, flag, datetime, position]
                console.log(param)
                DB.query(sql, param, (err, data)=>{
                    if(err){
                        console.log(err)
                    }
                })
            })
        }
        uploadFile(file_path)

    })

    //침입자 발견시
    socket.on('findIntruderToServer',(data)=>{
        //먼저 애플리케이션에 알람 보내고~
        socket.to(roomName).emit('alertToApp',"침입자 발견")
        //디비에 저장
        buffer = Buffer.from(data.photo, "base64");
        file_path = path.join(picPath, "./" + data.datetime.replace(/:/gi, "-") +".jpg")
        fs.writeFileSync(file_path, buffer); // 이미지 파일 resource에 저장
        var intruder_img_path
        const uploadFile = (path) => {
            const fileContent = fs.readFileSync(path) // 파일을 읽어서
            const params = {
                Bucket: 'ssavis',
                Key: data.datetime.replace(/:/gi, "-") +".jpg",
                Body: fileContent
            }
            s3.upload(params, function(err, data_intruder) {
                if (err) {throw err;}
                console.log('File Uploaded Successfully')
                print(data_intruder)
                intruder_img_path = data_intruder.Location
                const user_no=data_intruder.user_no
                const photo=intruder_img_path
                const datetime=data_intruder.datetime
                const sql='insert into intruders(user_no,photo,datetime) values(?,?,?)'
                const param=[user_no, photo, datetime]
                DB.query(sql, param, (err, data_intruder)=>{
                    if(err){
                        console.log(err)
                    }
                })
            })
        }
        uploadFile(file_path)
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
