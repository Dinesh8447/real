const userdb = require('../models/usermodels')
const bycrpty = require('bcryptjs')
const { errorhandler } = require('../utils/error')
const jwt = require('jsonwebtoken')



const signup = async (req,res,next) =>{
 const {username,email,password} = req.body
 const hash = bycrpty.hashSync(password,10)
 const newuser = await userdb.create({username,email,password:hash})
 try {
    await newuser.save()
    res.status(200).json('ok')    
 } catch (error) {
    next(errorhandler(550,'error from signup'))        
 }
}


const signin = async (req,res,next) =>{
   const {email,password} = req.body   
   try {
      const userdata = await userdb.findOne({email})
      if(!userdata) return next(errorhandler(404,'user not found!'))
      const validpws = bycrpty.compareSync(password,userdata.password)
      if(!validpws) return next(errorhandler(401,'password incorrect'))
      const token = jwt.sign({id:userdata._id},process.env.SECRETKEY)
      const {password:pass,...rest} = userdata._doc

      res.cookie('accesstoken',token,{httpOnly:true})
      .status(200)
      .json(rest)
      
      // res.status(200).json(token)   
    
   } catch (error) {
      next(error)        
   }
  }


  const google = async (req,res,next) =>{

   try {
      const user = await userdb.findOne({email:req.body.email})
      
      if(user){
      const token = jwt.sign({id:userdata._id},process.env.SECRETKEY)
      const {password:pass,...rest} = user._doc

      res.cookie('accesstoken',token,{httpOnly:true})
      .status(200)
      .json(rest)
      }
      else{
            const genratedpws = Math.random().toString(36).slice(-8)
            const hash = bycrpty.hashSync(genratedpws,10)
            const newuser = new userdb({username:req.body.username.split(" ").join("").toLowercase() + Math.random().toString(36).slice(-8),
            email:req.body.email,
            password:hash,
            avatar:req.body.photo
         })
         await newuser.save()

      const token = jwt.sign({id:userdata._id},process.env.SECRETKEY)
      
      const {password:pass,...rest} = userdata._doc

      res.cookie('accesstoken',token,{httpOnly:true}).status(200).json(rest)
      
   }
   } catch (error) {
      res.json(error)
   }

  }

  const signout =(req,res,next) =>{
   try {
      res.clearCookie('accesstoken')
      res.status(200).json('user has been logged out')
   } catch (error) {
      next(error)
   }
  }



module.exports={signup,signin,google,signout} 