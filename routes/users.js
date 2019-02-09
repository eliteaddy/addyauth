/**
 * @author: Adesile Isaiah Ayomide
 * aka: MasterAddy
 * Portfolio: https://eliteaddy.github.io
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { sessionChecker } = require('../config/auth');

//User Model
const User = require('../modal/User');

//login page
router.get('/login', sessionChecker, (req, res) => res.render('login'));

//register page
router.get('/register', sessionChecker, (req, res) => res.render('register'));

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, phone, password, password2 } = req.body;
    let errors = [];

    //Check required fields
    if (!name || !email || !phone || !password) {
        errors.push({ msg: 'Please fill in the fields' });
    }

    //Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    //Validation 
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            phone,
            password,
            password2
        });
    } else {
        // Validation Passed
        User.findOne({ email : email })
            .then(user => {
                if (user) {
                    //user exists
                    errors.push({ msg: 'Email is already Registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        phone,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name: name,
                        email: email,
                        phone: phone,
                        password: password
                    });

                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        //Set password to hashed
                        newUser.password = hash;
                        //Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can login');
                                res.redirect('/user/login');
                            })
                            .catch(err => console.log(err));

                    }))
                }
            });
    }
});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success_msg', 'You are logged out successfully');
    res.redirect('/user/login');
});

module.exports = router;