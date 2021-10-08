// const mongoose=require('mongoose')
// const bcrypt=require('bcrypt')
// const jwt=require('jsonwebtoken')
// //
// const saltRounds=10

// const userSchema=mongoose.Schema({
//     name:{
//         type:String,
//         maxlength:50
//     },
//     password:{
//         type:String,
//     },
//     email:{
//         type:String,
//         trim:true,//공백제거
//         unique:1
//     },
//     lastname:{
//         type:String,
//         maxlength:50
//     },
//     role:
//     {
//         type:Number,
//         default:0
//     },
//     image:String,
//     token:{
//         type:String
//     },
//     tokenExp:{
//         type:Number
//     },

// })


// //pre는 어떤걸 하기전에 먼저 하는 함수
// //save라는 명령어를 하면 밑에 함수 실행
// userSchema.pre('save',function(next){
//     //salt를 이용해서 비밀번호를 암호화
//     //saltRounds로 salt의 자릿수를 지정해주고 그 생성된 salt로 비밀번호 암호화

//     //현재 스키마에 있는 자기 자신
//     var user=this
//     if(user.isModified('password')){
//         bcrypt.genSalt(saltRounds, function(err, salt) {
//             if(err) return next(err)
    
//             //지금 현재 모델로 들어온 비밀번호를 salt를 이용해 암호화
//             bcrypt.hash(user.password, salt, function(err, hash) {
//                 // Store hash in your password DB.
//                 if(err) return next(err)//암호화 발새하다 에러 나면 리턴
    
//                 user.password=hash
//                 next()
//             });
//         });
//     }else{
//         next()
//     }
    
// })


// userSchema.methods.comparePassword=function(plainPassword,cb){
//     //plainpassword 12345,  암호화된 비밀번호 sdlf1@1~@23lkj
//     //둘이 같은지 확인
//     //플레인을 암호화해서 확인
//     bcrypt.compare(plainPassword,this.password, function(err,isMatch){
//         if(err)return cb(err)
//         return cb(null, isMatch)
//     })
    
// }

// userSchema.methods.generateToken=function(cb){
//     //jsonwebtoken 이용해서 토큰 생성
//     var user=this
//     //_id는 디비에 오토 인크리먼트 되는 값으로 유일값이다.
//     var token=jwt.sign(user._id.toHexString(),'secretToken')
//     //secretToken이라는 문자열을 이용해서 토크을 만든다


//     user.token=token
//     user.save(function(err,user){
//         //에러 발생하면 cb(callback 함수로 에러 리턴)
//         if(err)return cb(err)
//         //없으면 에러==null이고 user 정보를 리턴
//         cb(null,user)
//     })

// }


// //메소드는 객체의 인스턴스를 만들어야만 사용이 가능하지만 
// // 스태틱은 객체의 인스턴스를 만들지 않아도 사용이 가능합니다. 
// // const temp = new User() 이런식으로 선언하고난 뒤 
// // temp.(메소드) 이런식으로 호출해야만 쓸 수 있는 것이 메소드고요.
// // User.(스태틱) 이런식으로 호출할 수 있는 것이 스태틱입니다. 스태틱은 temp.(스태틱)을 형태로도 호출이 가능합니다. 
// userSchema.statics.findByToken=function(token,cb){
//     var user=this;
//     // user._id+''=token
//     jwt.verify(token,'secretToken',function(err,decoded){
//         //유저 아이디를 이용해서 유저를 찾은 다음에
//         //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 화긴


//         user.findOne({"_id":decoded,"token":token}, function(err,user){
//             if(err) return cb(err);

//             cb(null,user)
//         })



//     })



// }



// const User=mongoose.model('User',userSchema)


// module.exports={User}