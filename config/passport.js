const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models/User');

module.exports = (passport) => {
    const authenticateUser = (userName, password, done) => {
        User.findOne({ userName: userName })
            .then(user => {
                if (!user) {
                    return done(null, false, { 
                        message: 'The login credentials are incorrect.',
                        userName,
                    });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { 
                            message: 'The login credentials are incorrect.',
                            userName,
                         });
                    }
                });
            })
            .catch(err => console.log(err));
    };

    passport.use(new LocalStrategy({ usernameField: 'userName' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
};
