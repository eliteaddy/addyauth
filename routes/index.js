/**
 * @author: Adesile Isaiah Ayomide
 * aka: MasterAddy
 * Portfolio: https://eliteaddy.github.io
 */

const express = require('express');
const router = express.Router();
const { ensureAuthenticated, sessionChecker } = require('../config/auth');

router.get('/', sessionChecker, (req, res) => res.render('welcome'));

router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        user : {
            name: req.user.name,
            email: req.user.email,
            phone : req.user.phone
        }
    }));


module.exports = router;