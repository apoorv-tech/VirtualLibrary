const express = require('express');
const {requireauth} = require("../../middleware/authmiddleware")
const User = require('../../models/user')
const User2 = require('../../models/user2')
const Category = require('../../models/category')
const Book = require('../../models/book')
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const pdfTypes = ['application/pdf']
const router = express.Router();

router.get('/',requireauth,async(req,res)=>{
    let admin = false
    if(res.locals.user.admin)admin=true
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
    res.render('dashboard/dashboard',{
        fileused : "dashboard",
        admin : admin,
        books : books,
        categories: categories
    });
})

router.get('/addbook',requireauth,(req,res)=>{
    if(res.locals.user.admin){
        res.render('dashboard/addbook',{
            fileused : "addbook",
            book : new Book()
        });
    }else{
        res.send("waah bhaiya bina permission ke admin baaji")
    }
})


router.get('/profile',requireauth,(req,res)=>{
    res.render('dashboard/profile',{
        fileused : "profile",
    });
})

//Create Books
router.post('/addbook',async(req,res)=>{
    let userArr = []
    
    const u1 = {
        userid: res.locals.user._id,
    
    }

    const category = await Category.findOne({category: req.body.category})
    console.log("this is category "+category);
    

    userArr.push(u1)
    const book = new Book({
        title: req.body.name,
        category: req.body.category,
        pageCount: req.body.pageCount,
        description: req.body.description,
        users: userArr,
        count:1
    })



    if(req.body.cover != null && req.body.cover !== ''){
        savecover(book,req.body.cover)
    }

    if(req.body.pdf != null && req.body.pdf !== ''){
        savepdf(book,req.body.pdf)
    }

    try {
        const newBook = await book.save()
        
        if(category){
            let books = category.books;
            const obj2 = {
                bookid:book._id,
                title:book.title,
                coverImage: book.coverImagePath
            }
            books.push(obj2)
            let count = category.count +1
            await Category.updateOne({category: req.body.category}, {$set: { 'books' : books, 'count': count } } )
        }
        else{
            const obj2 = {
            bookid:book._id,
            title:book.title,
            coverImage: book.coverImagePath
            }
            const category1 = new Category({
                category: req.body.category,
                count : 1,
                books: [obj2]
            })
            try {
                await category1.save();
            } catch (error) {
                console.log("error in line 106");
                console.log(error);
                res.redirect("/dashboard")
            }

            
        }
        res.redirect('/dashboard')
    } catch (error) {
        console.log("here is erro in line 114");
        console.log(error);
        renderNewPage(res,book,true)
    }
})

async function renderNewPage(res,book,hasError= false){
    renderFormPage(res,book,'new',hasError)
}

async function renderFormPage(res,book,form,hasError= false){
    try {
        const params = {
            book: book,
            fileused:"addbook"
        }

        if(hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error Updating the book'
            }
            else {
                params.errorMessage = 'Error Creating the book'
            }
        }
        res.render(`dashboard/addbook`,params)
    } catch (error) {
        res.redirect('/dashboard')
    }
}

function savecover(book,coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data,'base64')
        book.coverImageType = cover.type
    }
}

function savepdf(book,pdfEncoded){
    if(pdfEncoded == null) return
    const pdf = JSON.parse(pdfEncoded)
    if(pdf != null && pdfTypes.includes(pdf.type)){
        book.pdf = new Buffer.from(pdf.data,'base64')
        book.pdfType = pdf.type
    }
}

module.exports= router;