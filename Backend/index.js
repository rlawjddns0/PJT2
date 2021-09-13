const express=require('express');
const app=express();
const port=5000
const bodyParser=require('body-parser')
const mongoose=require('mongoose');
const { User } = require('./models/User');






app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json())





mongoose.connect('mongodb+srv://jeongwoon:%40tkarnr12@cluster0.j3yib.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
}).then(()=>console.log("Mongodb Connected"))
    .catch(err=>console.log(err));



app.get('/',(req,res)=> res.send("Hellosss"))

app.post('/register',(req,res)=>{
    //회원가입 정보 클라이언트에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    const user=new User(req.body)
    user.save((err,userInfo)=>{
        if(err)return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })
})




app.listen(port,()=>console.log(`app starting on port ${port}...`))