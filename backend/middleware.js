const jwt=require("jsonwebtoken")
const {JWT_TOKEN}= require("./config")

function userMiddleWare(req,res,next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const jwtToken=authHeader.split(" ")[1]
    const verify=jwt.verify(jwtToken,JWT_TOKEN)
    if(verify.userId){
        req.userId=verify.userId,
        next()
    }else{
        res.status(403).send({
            msg:"wrong username/password"
        })
    }
}
module.exports=userMiddleWare