const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name:{
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image: String,
    token:{
        type : String
    },
    tokenExp:{
        type:Number
    }
})

userSchema.pre('save', function( next )
{
    var user= this;
    
    if(user.isModified('password')) //비밀번호를 수정하는 경우
    {
        bcrypt.genSalt(saltRounds, function(err, salt) 
        {
            if(err) 
                return next(err);
            
            bcrypt.hash(user.password, salt, function(err, hash) 
            {
                if(err) 
                    return next(err);
                
                user.password = hash;
                next();
            });
        });
    }
    else//비밀번호 이외의 정보를 수정하는 경우
    {
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword와 암호화된 비밀번호가 같은지 체크
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err)
            cb(err);
        
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    //jsonwebtoken을 아용해서 토큰 생성
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken'); 

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    //jsonwebtoken을 아용해서 토큰 생성
    var user = this;
    
    //토큰을 decode
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        user.findOne({
            "_id" : decoded, "token":token
        }, function(err, user){
            if(err) return cb(err);

            cb(null, user);
        })
    })
}


const User = mongoose.model('User', userSchema);

module.exports = {User}