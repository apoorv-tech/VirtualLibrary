const express = require('express');
const Book = require('../models/book')
const Category = require('../models/category')
const {requireauth} = require("../middleware/authmiddleware")
const router = express.Router();
const {requireauth} = require("../middleware/authmiddleware")

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
                room : book.title
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

module.exports= router;