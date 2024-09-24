const express = require("express");
const app=express()

app.get("/",function(){
    console.log("running")
})
app.listen(3000)
