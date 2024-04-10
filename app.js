const express = require('express')
const app = express()
require('dotenv').config()
require('./config/pg.config');

const cors = require('cors')
const PORT = process.env.PORT || 9001;


const routes = require('./routes/route')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/assets',express.static(process.cwd() + '/uploads'))



app.use("/api/v1/",routes)

app.use((req,res,next)=>{
    next({
        status:404,
        msg:"Not Found"
    })
})




app.use((error,req,res,next)=>{
    console.log('Err:',error)
    let status = error.status || 500
    let msg = error.msg || "Something went wrong"

    res.status(status).json({
        result: null,
        msg: msg,
        status: status
    })
})



app.listen(PORT,(err)=>{
    if(err){
        console.log("App Error:",err)
        console.log("Error listening to port:",PORT)
    }else{
        console.log("Server is listening on port:",PORT)
        console.log('Press Ctrl+C to quit.')
    }
})