module.exports = {
    checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            res.locals.user = req.user;
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
    },
    checkIsAdmin(req, res, next) {
        if (req.user.roles.includes('Admin')) {
            return next();
        }
        req.flash('error_msg', 'You are not allowed to view this resource.');
        res.redirect('/dashboard');
    }
}