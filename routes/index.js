const express = require('express');
const Book = require('../models/book')
const Category = require('../models/category')
const router = express.Router();

router.get('/',async(req,res)=>{
    let books = []
    try {
        books = await Book.find().sort({count: 'desc'}).limit(10).exec()       
    } catch (error) {
        books = []
    }
    let categories =[]
    try {
        categories = await Category.find().sort({count: 'desc'}).limit(10).exec()
    } catch (error) {
        categories=[]
    }
    res.render('index',{
        fileused : "main",
        books : books,
        categories:categories
    });
})

module.exports= router;