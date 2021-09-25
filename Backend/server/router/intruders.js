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


//침입 관리 기록 리스트 가져오기
router.get('/list/:user_no',function(req,res){
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

module.exports=router;