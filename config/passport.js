const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models/User');

module.exports = (passport) => {
    const authenticateUser = (username, password, done) => {
        User.findOne({ username: username }).select('+password')
            .then(user => {
                if (!user) {
                    return done(null, false, { 
                        message: 'The login credentials are incorrect.',
                        username,
                    });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { 
                            message: 'The login credentials are incorrect.',
                            username,
                         });
                    }
                });
            })
            .catch(err => console.log(err));
    };

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
};
