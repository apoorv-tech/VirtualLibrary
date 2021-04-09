const express = require("express")
const router = express.Router()
const User = require("../models/user")
const {requireauth} = require("../middleware/authmiddleware")
const jwt = require("jsonwebtoken")

//function to handle the errors
const handleError = (err)=>{
    console.log(err.code)
    const error = {email:"",password:""}
    if(err.message=="Incorrect Email")
    {
        error.email = "This email is not registered"
        return error
    }
    if(err.message=="Incorrect Password")
    {
        error.password="Incorrect Password"
        return error
    }
    if(err.code==11000)
    {
        error.email="This email is already registered"
        return error
    }
    else if(err.message.includes("user validation failed"))
    {
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path]=properties.message
        })
        return error
    }
}

//creating a jsonwebtoken
const maxage = 4*60*60*24
const createtoken = (id)=>{
    return jwt.sign({id},"white Hat wale",{
        expiresIn:maxage
    })
}

router.get("/login",(req,res)=>{
    if(res.locals.user){
        res.redirect('/dashboard')
    }else{
        res.render("authentication/auth",{
            fileused : "auth"
        })
    }
})

router.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try {
        const user = await User.login(email,password)
        const token = createtoken(user._id)
        res.cookie("jwt",token,{maxage:maxage*1000,httpOnly:true})
        res.status(201).json(user)

    } catch (error) {
        const errors = handleError(error)
        res.status(400).send(errors)
    }
})

router.get("/signup",(req,res)=>{
    if(res.locals.user){
        res.redirect('/dashboard')
    }else{
        res.render("authentication/auth",{
            fileused : "auth"
        })
    }
})

router.post("/signup",async(req,res)=>{
    const {username,email,password} = req.body
    const admin = false
    try {
        const newuser = await User.create({username,admin,email,password})
        const user = await User.login(email,password)
        const token = createtoken(user._id)
        res.cookie("jwt",token,{maxage:maxage*1000,httpOnly:true})
        res.status(201).json(user)
    } catch (error) {
        const errors=handleError(error)
        res.status(400).send(errors)
    }
})

router.get("/logout",(req,res)=>{
    res.cookie("jwt","",{maxAge:0.1})
    req.logout()
    res.redirect("/")
})

module.exports = router