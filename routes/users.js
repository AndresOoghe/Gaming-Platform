const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user.model');
const { setSharedProperties } = require('../utilities/properties');
const passport = require('passport');

module.exports = {
    getLogin: (req, res, ) => res.render('auth/login', { layout: 'layouts/userLayout' }),
    getRegister: (req, res) => res.render('auth/register', { layout: 'layouts/userLayout' }),
    getLogout: (req, res) => {
        req.logOut();
        req.flash('succes_msg', 'You are logged out.');
        res.redirect('/login');
    },

    postLogin: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
        })(req, res, next);
    },
    postRegister: (req, res, next) => {
        const { name, password, email } = req.body;
        const { error } = validate(req.body);
        if (error) {
            res.render('auth/register', {
                layout: 'layouts/userLayout',
                name,
                password,
                email,
                errors: error.details
            });
        } else {
            User.findOne({ email: req.body.email })
                .then(user => {
                    if (user) {
                        res.render('auth/register', {
                            layout: 'layouts/userLayout',
                            name,
                            password,
                            email,
                            errors: ['User already registered.']
                        });
                    } else {
                        const newUser = new User({
                            name: name,
                            password: password,
                            email: email,
                        });

                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser.save()
                                    .then(user => {
                                        req.flash(
                                            'succes_msg',
                                            'You are now registered and can log in.',
                                        );
                                        res.redirect('/login');
                                    })
                                    .catch(err => { console.log(err) });
                            });
                        });
                    }
                });
        }
    },
}