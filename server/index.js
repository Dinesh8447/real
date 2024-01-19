//packages
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
// const path = require('path')
// const dirname = path.resolve();
require('dotenv').config()





//import
const userroute = require('./router/userrouter')
const authroute = require('./router/authroute')
const listingroute = require('./router/listingroute')

app.use(cookieparser())
app.use(bodyparser.json())
app.use(cors({
    origin:['http://localhost:5173'],
    credentials:true
}))


// app.use(express.static(path.join(dirname,'/client/dist')))
// app.get('*',(req,res)=>{
//     res.sendFile(path.join(dirname,'client','dist','index.html'))
// })

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