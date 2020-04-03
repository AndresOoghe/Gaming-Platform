const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user.model');
const passport = require('passport');
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware/auth');
const initializePassport = require('../passport-config');

initializePassport(
    passport,
    async email => await User.findOne({ email: email }),
    async id => await User.findById(id),
);

router.get('/', checkAuthenticated, (req, res) => {
    res.render('index');
});

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('auth/login');
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('auth/register');
});

router.post('/register', checkNotAuthenticated, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('User already registered.');
    }

    user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    });

    try {
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.render('/register', {
            user: user,
            errorMessage: 'Error creating User',
        });
    }
});


router.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut();
    res.redirect('/login');
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
}),

    module.exports = router;