/**
 * @author: Adesile Isaiah Ayomide
 * aka: MasterAddy
 * Portfolio: https://eliteaddy.github.io
 */

const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

//DB
const db = require("./config/keys").MongoURI;

//Connect to mongo
mongoose.connect(db, { useNewUrlParser : true })
.then(()=> console.log('MongoDb Connected...'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(session({
    key: 'user_id',
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        expires: 500000
    }
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//Connect Flash
app.use(flash());


//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});



//ROUTES
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port '+ PORT));