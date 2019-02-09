module.exports = {
    ensureAuthenticated : (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Please You Have To Login To View This Page');
        res.redirect('/user/login');
    },
    sessionChecker : (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            next();
        }
    }
};