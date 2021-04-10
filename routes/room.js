const express = require('express');
const Book = require('../models/book')
const Category = require('../models/category')
const router = express.Router();


router.get('/:id',async(req,res)=>{
    
    

    try {
        const book =  await Book.findOne({_id: req.params.id})
        if(book){
            let users = book.users;
            res.render('room/room',{
                fileused : "room",
                users:users,
                pdf : book.pdfPath
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