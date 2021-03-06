const bcrypt = require('bcrypt');
const { User, validate } = require('../models/User');
const { setSharedProperties } = require('../utilities/properties');
const { formatErrorMessages } = require('../utilities/errors');
const passport = require('passport');
const db = require('../database/users');

module.exports = {
    getLogin: (req, res, ) => {
        const username = req.session.username;
        delete req.session.username;
        const redirectTo = req.query.redirect || req.session.redirectTo || '/';
        req.session.redirectTo = redirectTo;
        res.render('auth/login', {username: username});
    },
    getRegister: (req, res) => res.render('auth/register'),
    getLogout: (req, res) => {
        req.logOut();
        res.redirect('/');
    },

    postLogin: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                req.flash('error_msg', info.message);
                req.session.username = req.body.username;
                return res.redirect('/login');
            };
            req.logIn(user, err => {
                if (err) return next(err);
                const redirect = req.session.redirectTo || '/';
                delete req.session.redirectTo;
                req.user = user;
                return res.redirect(redirect);
            });
        })(req, res, next);
    },
    postRegister: (req, res, next) => {
        const { username, password, email } = req.body;
        const { error } = validate(req.body);
        if (error) {
            res.render('auth/register', {
                username,
                password,
                email,
                errors: formatErrorMessages(error.details),
            });
        } else {
            db.findByusername(req.body.username)
                .then(user => {
                    if (user) {
                        res.render('auth/register', {
                            username,
                            password,
                            email,
                            errors: [{ message: 'Username already registered.' }]
                        });
                    } else {
                        db.findByEmail(req.body.email)
                            .then(user => {
                                if (user) {
                                    res.render('auth/register', {
                                        username,
                                        password,
                                        email,
                                        errors: [{ message: 'Email already registered.' }]
                                    });
                                } else {
                                    const newUser = new User({
                                        username: username,
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
                                                    req.session.username = newUser.username;
                                                    res.redirect('/login');
                                                })
                                                .catch(err => { console.log(err) });
                                        });
                                    });
                                }
                            })
                    }
                });
        }
    },
}
