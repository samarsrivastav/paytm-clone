const express = require("express");
const mainRouter=require('./routes/index')
const cors=require('cors')
const app=express()


app.use(cors())
app.use(express.json())


app.use("/api/v1",mainRouter)

app.use(function(err,req,res,next){
    res.send({
        msg:"something is wrong"
    })
})

app.listen(3000)
