const express=require("express")
const { route } = require("./user")
const userMiddleWare = require("../middleware")
const { Account, User } = require("../db")
const { default: mongoose } = require("mongoose")


const router=express.Router()



router.get("/balance",userMiddleWare,async(req,res)=>{
    const account=await Account.findOne({
        userId:req.userId
    })
    res.json({
        balance:account.balance
    })
})


router.post("/transfer",userMiddleWare,async (req,res)=>{
    const session=await mongoose.startSession();
    session.startTransaction()
    const {amount,to}=req.body;
    const account=await Account.findOne({userId:req.userId}).session(session)
    console.log(account.balance)
    if(!account || account.balance<amount ||amount<=0){
        await session.abortTransaction()
        res.send({
            msg:"Insufficient Balance"
        })
    }

    const reciever=await Account.findOne({userId:to}).session(session)
    if(!reciever){
        await session.abortTransaction()
        res.send({
            msg:"User does'nt exist"
        })
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();
    session.endSession();
    res.json({
        msg:"Amount has been sent--> Rs. "+amount
    })
})




module.exports=router