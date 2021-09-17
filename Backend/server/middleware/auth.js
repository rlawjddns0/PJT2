const {User}=require('../models/User')
let auth=(req,res,next)=>{
    //인증 처리를 하는곳



    //클라이언트 쿠키에서 토큰을 가져온다
    //x_auth라는 이름으로 저장 되어 있다.
    const token=req.cookies.x_auth;
    console.log(token)


    //토큰을 ㅂㄱ호화 한 후 유저를 찾는다.
    User.findByToken(token,(err,user)=>{
        console.log(token)
        console.log(user)
        if(err) return err;
        if(!user) return res.json({isAuth:false, error:true})

        req.token=token
        req.user=user;

        //next없으면 미들웨어에 계속 남아있다.
        next();



    })

    //유저가 있으면 인증 Okay

    //유저가 없으면 인증 NO





}


module.exports={auth}