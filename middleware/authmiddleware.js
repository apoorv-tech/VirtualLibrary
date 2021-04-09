//a middleware for authentication
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const requireauth = (req,res,next)=>{
    const token  = req.cookies.jwt
    if(token)
    {
        jwt.verify(token,"white Hat wale",(err,decodedToken)=>{
            if(err){
                res.redirect("/login")
            }
            else{
                res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
                next()
            }
        })
    }else{
        if(req.user)
        {
            next()
        }else{
            res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
            res.redirect('/login')
        }
    }
}

//check current user
const checkuser = (req,res,next)=>{
    const token  = req.cookies.jwt
    if(!req.user)
    {
        if(token)
        {
            jwt.verify(token,"white Hat wale",async (err,decodedToken)=>{
                if(err){
                    res.locals.user=null
                    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
                    next()
                }
                else{
                    let user = await User.findById(decodedToken.id)
                    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
                    res.locals.user = user
                    next()
                }
            })
        }else{
            res.locals.user=null
            res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
            next()
        }
    }
    else{
        res.locals.user = req.user
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next()
    }
}

module.exports = {requireauth,checkuser}