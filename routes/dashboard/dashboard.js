const express = require('express');
const {requireauth} = require("../../middleware/authmiddleware")
const User = require('../../models/user')
const User2 = require('../../models/user2')
const Book = require('../../models/book')
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const pdfTypes = ['application/pdf']
const router = express.Router();

router.get('/',requireauth,(req,res)=>{
    let admin = false
    if(res.locals.user.admin)admin=true

    res.render('dashboard/dashboard',{
        fileused : "dashboard",
        admin : admin
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
    const book = new Book({
        title: req.body.name,
        category: req.body.category,
        pageCount: req.body.pageCount,
        description: req.body.description,
    })

    if(req.body.cover != null && req.body.cover !== ''){
        savecover(book,req.body.cover)
    }

    if(req.body.pdf != null && req.body.pdf !== ''){
        savepdf(book,req.body.pdf)
    }

    try {
        const newBook = await book.save()
        res.redirect('/dashboard')
    } catch (error) {
        renderNewPage(res,book,true)
    }
})

async function renderNewPage(res,book,hasError= false){
    renderFormPage(res,book,'new',hasError)
}

async function renderFormPage(res,book,form,hasError= false){
    try {
        const params = {
            book: book
        }
        if(hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error Updating the book'
            }
            else {
                params.errorMessage = 'Error Creating the book'
            }
        }
        res.render(`/dashboard/addbook/${form}`,params)
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