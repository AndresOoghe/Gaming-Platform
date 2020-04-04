const bcrypt = require('bcrypt');
const { User, validate } = require('../models/User');
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
        const { userName, password, email } = req.body;
        const { error } = validate(req.body);
        if (error) {
            res.render('auth/register', {
                layout: 'layouts/userLayout',
                userName,
                password,
                email,
                errors: error.details
            });
        } else {
            User.findOne({ userName: req.body.userName })
                .then(user => {
                    if (user) {
                        res.render('auth/register', {
                            layout: 'layouts/userLayout',
                            userName,
                            password,
                            email,
                            errors: ['User already registered.']
                        });
                    } else {
                        const newUser = new User({
                            userName: userName,
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
