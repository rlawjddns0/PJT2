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





//사용자가 설정한 모드 추가하기
router.post('/custom',function(req,res){
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
router.get('/customList/:user_no',function(req,res){
    
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

//모드 삭제
router.delete('/delete/:no',function(req,res){
    const no=req.params.no
    DB.query('delete from mode where no=?',[no],(err,data)=>{
        if(err){
            console.log(err)
        }else{
            console.log("모드 하나 삭제")
        }
    })
})

//현재 사용자가 실행하고 있는 모드
router.get('/current_mode/:user_no',function(req,res){
    const no=req.params.user_no
    //먼저 사용자 user_no로 커런트 모드에서 가져옴
    DB.query('select * from current_mode where user_no=?',[user_no],(err,data)=>{
        if(err){
            console.log(err)
        
        }else if(data.mode_no==null){
            return res.status(200).json({
                success:true,
                msg:"현재 작동중인 모드가 없습니다.",
                data:null
            })
        }
        else{
            const mode_no=data.mode_no
            DB.query('select * from mode where mode_no=?',[mode_no],(err,data)=>{
                if(err){
                    console.log(err)
                }else{
                    return res.status(200).json({
                        success:true,
                        msg:"현재 작동하고 있는 모드",
                        data,
                    })
                }
            })
        }
    })
})


module.exports=router;