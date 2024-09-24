const express=require("express")
const zod=require("zod")
const { User } = require("../db")
const jwt=require("jsonwebtoken")
const {JWT_TOKEN}= require("../config")
const router=express.Router()
const UserMiddleware=require("../middleware")

const schema=zod.object({
    firstName:zod.string().min(1),
    lastName:zod.string().min(1),
    username:zod.string().email(),
    password:zod.string().min(6),
})

router.get("/bulk",async (req,res)=>{
    const filter=req.body.filter
    const users=await User.find({
        $or: [
            { firstName: { "$regex": filter } },
            { lastName: { "$regex": filter} }
        ]
    })
    res.send({
        users: users.map((user) => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
})

router.post("/signup",async (req,res)=>{
    const body=req.body
    const response=schema.safeParse(body)
    if(!response.success){
        return res.status(411).json({
            msg:"Wrong input"
        })
    }
    const existingUser=await User.findOne({username:body.username})
    if(existingUser){
        return res.status(411).json({
            msg:"user already exists"
        })
    }

    const user=await User.create({
        username:body.username,
        firstName:body.firstName,
        lastName:body.lastName,
        password:body.password
    })
    const userId=user._id
    const token=jwt.sign({userId},JWT_TOKEN)
    res.json({
        msg:"User created succesfully",
        token:token
    })
})
const signinSchema=zod.object({
    username:zod.string().email(),
    password:zod.string().min(6),
})

router.post("/signin",async (req,res)=>{
    const parse=signinSchema.safeParse(req.body)
    if(!parse.success){
        res.status(411).send({
            msg:"wrong input while signin"
        })
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if(user){
        const token= jwt.sign({userId:user._id},JWT_TOKEN)
        res.json({
            msg:"Login succesfully",
            token:token
        })
    }
})




module.exports=router