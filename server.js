const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const Indexrouter  = require('./routes/index')
const viewbookrouter  = require('./routes/viewbook/viewbook')
const Authrouter  = require('./routes/authcontroller')
const dashboardrouter  = require('./routes/dashboard/dashboard')
const {requireauth,checkuser} = require("./middleware/authmiddleware")
const dotenv = require('dotenv');
const mongoose = require("mongoose")
const cookieparser = require("cookie-parser")
const methodoverride = require('method-override')
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser')

dotenv.config({
	path:"./config/.env"
})

require('./config/passport-setup')(passport);

//encrypting Cookies
app.use(session({
    secret:"keyboard cat",
    resave:false,
    saveUninitialized:false
}))

// creating session using cookies
app.use(passport.initialize());
app.use(passport.session());

//setting view engine as ejs
app.set('view engine','ejs')
app.set('views',__dirname+'/views')

//using express-ejs-layouts
app.set('layout','layouts/layout')
app.use(expressLayouts)

//setting public for static files
app.use(express.static('public'))

//other middlewares
app.use(methodoverride('_method'))
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(cookieparser())
app.use("*",checkuser)

//connect to db
const connectDB = require('./config/db');
connectDB();


//setting up routers
app.use('/',Indexrouter)
app.use('/dashboard',dashboardrouter)
app.use('/auth', require('./routes/auth'));
app.use('/viewbook',viewbookrouter);
app.use(Authrouter)


//starting the app
app.listen(process.env.PORT || 4000,(err)=>{
    if(err)console.log(err)
    else console.log('app has started')
})