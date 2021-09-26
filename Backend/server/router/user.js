const bodyParser=require('body-parser');
const path=require('path');
const bcrypt=require('bcrypt')
const DB=require('../config/DBconfig')
const saltRounds=10
const express = require('express');
var app = express();
const router=express.Router()





// 로직 1. WebSocket 서버, WebClient 통신 규약 정의
const server = require('http').createServer(app);
const io = require('socket.io')(server)


var fs = require('fs'); // required for file serving
const { application } = require('express');



//로그인
router.post('/login',function(req,res){
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
router.post('/register',function(req,res){
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
                    if(err){
                        console.log(err)
                    }else{
                        //검사 다 끝나고 에러 없으면 current_mode에 초기값 집어넣기
                        DB.query('select * from user where userid=?',[userid],(err,data)=>{
                            if(err){
                                console.log(err)
                            }else{
                                DB.query('insert into user(user_no,mode_no) values(?,?)',[data.no,null],(err,data)=>{
                                    if(err){
                                        console.log(err)
                                    }
                                })
                            }
                        })
                        return res.status(200).json({
                            success:true
                        })
                    }
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


module.exports=router;