const jwt = require( "jsonwebtoken")
const { errorhandler } = require("./error")

 const verifytoken = (req,res,next) =>{
    const token = req.cookies.accesstoken
    if(!token) return next(errorhandler(401,'Unauthorized'))
    jwt.verify(token,process.env.SECRETKEY,(err,user)=>{
        if(err) return next(errorhandler(403,'Forbidden'))

        req.user = user
        next()
    })
}

module.exports={verifytoken}