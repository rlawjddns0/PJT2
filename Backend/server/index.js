const bodyParser=require('body-parser');
const path=require('path');
const bcrypt=require('bcrypt')
const DB=require('./config/DBconfig')
const saltRounds=10
const { swaggerUi, specs } = require('./modules/swagger');

// Websocket 서버 구동을 위한 서버 코드입니다.

// 노드 로직 순서
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const express = require('express');

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



//로그인
app.post('/api/users/login',function(req,res){
    const body=req.body
    const userid=body.userid
    const password=body.password
    console.log(userid)
    console.log(password)
    DB.query('select * from user where userid=?',[userid],(err,data)=>{
        if(err){
            console.log(err)
        }
        if(data.length==0)//아이디가 없다.
        {
            return res.status(200).json({
                success:false,
                msg:"아이디를 확인해주세요."
            })
        }
        var user=data[0]

        //패스워드 확인전 암호화 복호화 해서 비교한다~
        const validPassword = bcrypt.compare(password, user.password);
        // console.log(user.password)
        if(validPassword){
            return res.status(200).json({
                success:true,
                msg:"로그인 성공",
                user:data,
            })
        }else{
            return res.status(200).json({
                success:false,
                msg:"비밀번호가 틀렸습니다."
            })
        }
        


    })



})

//사용자 회원가입
app.post('/api/users/register',function(req,res){
    const body=req.body;
    console.log(body)
    const userid=body.userid;
    const email=body.email;
    const password=body.password;
    console.log(userid)
    console.log(email)

    DB.query('select * from user where userid=?',[userid],(err,data)=>{
        //디비에 저장된 값이 없으면 비회원
        if(data.length==0){
            //회원가입 전 비밀번호 암호화 해야된다~
            
            console.log("회원가입 가능~")
            bcrypt.hash(password,saltRounds,(error,hash)=>{
                
                DB.query('insert into user(`userid`, `email`,`password`) values(?,?,?)',[
                    userid,email,hash
                ],(err,row)=>{
                    if(err)console.log(err)
                })
                return res.status(200).json({
                    success:true
                })
            })
            
        }else{
            return res.status(400).json({
                success:false,
                msg:'이미 있는 회원입니다.'
            })
        }
    })
    


})


app.post('/api/mode/custom',function(req,res){
    const body=req.body
    const user_no=body.user_no
    const mode_name=body.mode_name

    const iot=body.iot
    const time=body.time
    const day=body.day
    DB.query('insert into mode(`user_no`,`mode_name`,`iot`,`time`,`day`) values(?,?,?,?,?)',
    [user_no,mode_name,iot,time,day],(err,data)=>{
        if(err)console.log(err)

        return res.status(200).json({
            success:true,
            msg:"모드저장 완료"
        })

    })

})

//사용자가 가지고 있는 모드 리스트
app.get('/api/mode/customList/:user_no',function(req,res){
    
    const user_no=req.params.user_no
    DB.query('select * from mode where user_no=?',[user_no],(err,data)=>{
        if(err)console.log(err)
        return res.status(200).json({
            success:true,
            msg:"사용자가 설정한 모드",
            data
        })
    })

})

//분실물 리스트 받아오기
app.get('/api/belongings/list/:user_no',function(req,res){
    const user_no=req.params.user_no
    //현재 사용중인 유저의 분실물중 찾지 못한것(false값)들
    DB.query('select * from belongings where user_no=? and flag=?',[user_no,false],
    (err,data)=>{
        if(err)console.log(err)
        
        return res.status(200).json({
            success:true,
            msg:"현재 분실물 리스트 정보",
            data
        })
    })
})

//찾은 분실물 체크
app.post('/api/belongings/check',function(req,res){
    const body=req.body
    //분실물 번호
    const no=body.no
    //no값의 분실물 찾았다고 flag값 true로 바꾼다.
    DB.query('update belongings set flag=? where no=?',[true,no],
    (err,data)=>{
        if(err)console.log(err)
        if(data.length>0){
            return res.status(200).json({
                success:true,
                msg:"체크완료"
            })
        }
    })
})

//침입 관리 기록 리스트 가져오기
app.get('/api/intruders/list/:user_no',function(req,res){
    const user_no=req.params.user_no
    const sql='select * from intruders where user_no=?'
    const param=[user_no]

    DB.query(sql,param,(err,data)=>{
        if(err){
            console.log(err)
        }else{
            return res.status.json({
                success:true,
                msg:"침입관리 기록 리스트",
                data
            })
        }
    })

})







//분실물 저장??-> 이건 터틀봇이 하는 일인데





//########################## 3api 끝~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




server.listen(port,()=>console.log(`app starting on port ${port}...`))

const roomName = 'team';




//##############################소켓 연결 후#################################
//연결 버튼 누르면
io.on('connection', socket => {
    console.log("연결~~~~ 됐다 ㅅㅂ!")
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

})