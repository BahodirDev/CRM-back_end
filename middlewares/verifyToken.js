
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys/config');
const User = require('../model/Employer');


module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"Ro'yhatdan o'tishingiz zarur 1"})
    }else{
        const token = authorization.replace('social','');
        jwt.verify(token,JWT_SECRET,(err,payload)=>{
            if(err){
                console.log(err);
            return res.status(401).json({error:"Ro'yhatdan o'tishingiz zarur 2"})
            }else{
                const {_id} = payload;
                console.log(payload,'payload');
                User.findById(_id)
                .then(user=>{
                    req.user = user;
                    req.roles = user.role.roles;
                    next()
                })
            }
        })
    }
}

