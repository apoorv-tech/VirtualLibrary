const express = require('express');
const {requireauth} = require("../../middleware/authmiddleware")
const Book = require('../../models/book')
const User = require("../../models/user")
const User2 = require("../../models/user2")
const Category = require("../../models/category")
const router = express.Router();

router.get('/',async(req,res)=>{
    let books = []
    try {
        // let query = await Book.find()
        // console.log(query);
        console.log(req.query.title);
        if(req.query.title != null && req.query.title != ''){
             books = await Book.find({"title": req.query.title})
        }
        else{
            books = await Book.find()
        }   
        // console.log(query);
        
        
        
    } catch (error) {
        console.log(error);
        books = []
    }
    
    res.render('viewbook/viewbook',{
        fileused : "viewbook",
        books: books,
        searchOptions: req.query
    });
})
router.get('/category/:id',async(req,res)=>{
    
    

    try {
        const category =  await Category.findOne({category: req.params.id})
        if(category){
            let books = category.books;
            res.render('viewbook/viewbook',{
                fileused : "category",
                category:category.category,
                books: books,
                searchOptions: req.query
            });
        }
        else{
            window.alert("no Such category")
            res.redirect("/")
        }
        
        
        
        
    } catch (error) {
        console.log(error);
        res.redirect('/viewbook')
    }
    
    
})
router.get('/type1/:id',requireauth,async(req,res)=>{
    
    

    try {
        const book =  await Book.findOne({_id: req.params.id})
        let users = book.users;
        let exists = false;
            for (let index = 0; index < users.length; index++) {
                const element = users[index];
               
                const eluserid = String(element.userid)
            
                if (eluserid==res.locals.user._id) {
                    exists=true;
                    break;
                }
                
            }
        
        if(exists){
            if(res.locals.user.firstName)
                res.redirect('/room/'+book._id+'?uid='+res.locals.user.firstName+'&&hassub=false&&room='+book.title)
            else
            res.redirect('/room/'+book._id+'?uid='+res.locals.user.username+'&&hassub=false&&room='+book.title)
        }
        else{
            res.render('viewbook/subscribe',{
                fileused : "subscribe",
                book: book,
                subscribed:exists
            });
        }
        
    } catch (error) {
        console.log(error);
        res.redirect('/viewbook')
    }
    
    
})
router.get('/type2/:id',requireauth,async(req,res)=>{
    
    

    try {
        const book =  await Book.findOne({_id: req.params.id})
        console.log(book.title);
        let users = book.users;
        let exists = false;
            for (let index = 0; index < users.length; index++) {
                const element = users[index];
                
                const eluserid = String(element.userid)
            
                if (eluserid==res.locals.user._id) {
                    exists=true;
                    break;
                }
                
            }
            res.render('viewbook/subscribe',{
                fileused : "subscribe",
                book: book,
                subscribed:exists
            });
        
        
    } catch (error) {
        console.log(error);
        res.redirect('/viewbook')
    }
    
    
})

router.get('/subscribe/:id',requireauth,async(req,res)=>{
    
    try {
        const book =  await Book.findOne({_id: req.params.id})
        
        let users = book.users;
        let exists = false;
        let booksArr = res.locals.user.books;
        const obj2 = {
            bookid:req.params.id,
            title:book.title,
            coverImage: book.coverImagePath
        }
        booksArr.push(obj2);

        if(res.locals.user.displayName){
            await User2.updateOne({_id: res.locals.user._id}, {$set: { 'books' : booksArr}} )
        }
        else{
            await User.updateOne({_id: res.locals.user._id}, {$set: { 'books' : booksArr}} )
        }

        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            
            const eluserid = String(element.userid)
        
            if (eluserid==res.locals.user._id) {
                exists=true;
                break;
            }
            
        }
        if(!exists){
            const obj1 = {
                userid: res.locals.user._id
            }
            users.push(obj1);
            let count = book.count +1
            await Book.updateOne({_id: req.params.id}, {$set: { 'users' : users, 'count': count } } )
            const hassub = true
            res.render('room/room',{
                fileused : "room",
                users:users,
                pdf : book.pdfPath,
                room : book.title,
                bk : book
            })
        }
        
        
    } catch (error) {
        console.log(error);
        res.redirect('/viewbook')
    }
    
    
})

router.get('/unsubscribe/:id',requireauth,async(req,res)=>{
    
    try {
        const book =  await Book.findOne({_id: req.params.id})
        
        let users = book.users;
        let exists = false;
        let booksArr = res.locals.user.books;
        

        let i,j;

            for (let index = 0; index < users.length; index++) {
                const element = users[index];
                console.log("element" + element);
                const eluserid = String(element.userid)
            
                if (eluserid==res.locals.user._id) {
                    i = index;
                    exists=true;
                    break;
                }
                
            }
            for (let index = 0; index < booksArr.length; index++) {
                const element = booksArr[index];
                console.log("element" + element);
                const eluserid = String(element.bookid)
            
                if (eluserid==req.params.id) {
                    j = index;
                    
                    break;
                }
                
            }
            if(exists){
                
                users.splice(i,1);
                booksArr.splice(j,1)
                if(res.locals.user.displayName){
                    await User2.updateOne({_id: res.locals.user._id}, {$set: { 'books' : booksArr}} )
                }
                else{
                    await User.updateOne({_id: res.locals.user._id}, {$set: { 'books' : booksArr}} )
                }
                let count = book.count -1
                await Book.updateOne({_id: req.params.id}, {$set: { 'users' : users, 'count':count}} )

                
                res.redirect('/dashboard');
            }
        
        
    } catch (error) {
        console.log(error);
        res.redirect('/viewbook')
    }
    
    
})

module.exports= router;