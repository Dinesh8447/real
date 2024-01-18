//packages
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()





//import
const userroute = require('./router/userrouter')
const authroute = require('./router/authroute')
const listingroute = require('./router/listingroute')

app.use(cookieparser())
app.use(bodyparser.json())
app.use(cors({
    // origin:['http://localhost:5173'],
    origin:['https://real-estate-j5w6.vercel.app'],
    credentials:true
}))
//routes
app.use('/api/user',userroute)
app.use('/api/auth',authroute)
app.use('/api/listing',listingroute)


//error middleware
app.use((err,req,res,next)=>{
    const statuscode = err.statuscode || 500
    const message = err.message || 'internal server error'
    return res.status(statuscode).json({
        success:false,
        statuscode,
        message
    })
})






mongoose.connect(process.env.MONGODB)
.then(()=>console.log('connected'))
.catch(e=>console.log(e))


app.listen(4000,()=>{
    console.log('running.....4000')
})