module.exports = {
    checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource.')
        res.redirect('/login');
    },
    checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        next();
    }
}