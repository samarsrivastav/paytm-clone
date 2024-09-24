const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/paytm")
const UserSchema= new mongoose.Schema({
    firstName:String,
    lastName:String,
    username:String,
    password:String
})
const User=mongoose.Model("User",UserSchema)
module.exports={
    User
}