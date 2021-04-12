const express = require('express');
const Book = require('../models/book')
const Category = require('../models/category')
const {requireauth} = require("../middleware/authmiddleware")
const router = express.Router();

router.get('/:id',requireauth,async(req,res)=>{
    try {
        const book =  await Book.findOne({_id: req.params.id})
        const exist = false
        if(book){
            let users = book.users;
            res.render('room/room',{
                fileused : "room",
                users:users,
                pdf : book.pdfPath,
                room : book.title,
                bk : book
            });
        }
        else{
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
        res.redirect('/dashboard')
    } 
})


router.get('/voice/:id',requireauth,async(req,res)=>{
    let ud
    if(res.locals.user.firstName){
        ud=res.locals.user.firstName 
    }else{
        ud=res.locals.user.username
    }
    res.render('room/voice',{
        fileused : "voice",
        roomId : req.params.id,
        ud : ud 
    })
})



module.exports= router;