const express=require('express');
const app=express();
const port=5000
const mongoose=require('mongoose');
const { User } = require('./models/User');
const cookieParser=require('cookie-parser')
const config=require('./config/key')
const { auth }=require('./middleware/auth')
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));
app.use(express.json())





mongoose.connect(config.mongoURI,{
}).then(()=>console.log("Mongodb Connected"))
    .catch(err=>console.log(err));



app.get('/',(req,res)=> res.send("Hellosss"))



//회원가입
app.post('/api/user/register',(req,res)=>{
    //회원가입 정보 클라이언트에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    const user=new User(req.body)
    //save하기전에 암호화후 디비에 저장
    user.save((err,userInfo)=>{
        if(err)return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })
})

//로그인
app.post('/api/user/login',(req,res)=>{
    //요청된 데이터가 디비에 있는지 확인
    
    User.findOne({email:req.body.email},(err,user) =>{
        if(!user){
            return res.json({
                loginSuccess:false,
                message:"이메일이 존재하지 않습니다."
            })
        }
   
        //디비에 있다면 현재 들어온 비밀번호가 디비에 있는것과 같은지 확인
        user.comparePassword(req.body.password, (err,isMatch)=>{
            if(!isMatch)
            return res.json({loginSuccess:false,message:"비밀번호가 틀렸습니다."})

            //맞다면 토큰 생성
            user.generateToken((err,user)=>{ 
            if(err)return res.status(400).send(err);
            
            //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess:true,userId:user._id})
            })

        })

    })

})

//auth는 콜백함수 가기전 중간에서 무언가를 해주는
app.get('/api/user/auth', auth ,(req,res)=>{
    //미들웨어를 거치고 여기까지 통과한것은 auth가 True--> token이 서로 같다

    res.status(200).json({
        _id:req.user._id,
        isAdmin:req.user.role===0?false:true,
        isAuth:true,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname,
        role:req.user.role,
        image:req.user.image
    })


})


app.get('/api/user/logout',auth,(req,res)=>{
    console.log(req.user)
    // console.log(req.user.token)

    User.findOneAndUpdate({_id:req.user._id},
        {token:""},
        (err,user)=>{
            if(err) return res.json({success:false,err})
            return res.status(200).send({
                success:true
            })
    })

})









app.listen(port,()=>console.log(`app starting on port ${port}...`))