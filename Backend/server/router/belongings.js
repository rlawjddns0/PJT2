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



//분실물 리스트 받아오기
router.get('/list/:user_no',function(req,res){
    const user_no=req.params.user_no
    //현재 사용중인 유저의 분실물중 찾지 못한것(false값)들
    DB.query('select * from belongings where user_no=?',[user_no,1],
    (err,data)=>{
        if(err)console.log(err)
        
        return res.status(200).json({
            success:true,
            msg:"현재 분실물 리스트 정보",
            data:data
        })
    })
})

//찾은 분실물 체크
router.put('/check/:no',function(req,res){
    //분실물 번호
    const no=req.params.no
    //no값의 분실물 찾았다고 flag값 true로 바꾼다.
    DB.query('delete belongings where no=?',[true,no],
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

module.exports=router;