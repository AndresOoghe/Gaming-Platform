if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const { checkAuthenticated, checkNotAuthenticated, checkIsAdmin } = require('./middleware/auth');
const { setActive } = require('./middleware/routing');
const { getLogin, postLogin, getRegister, postRegister, getLogout } = require('./routes/auth');

// Passport config
require('./config/passport')(passport);

// EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/general');
app.use(expressLayouts);
app.use(express.static('public'));

// Bodyparser
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// Express Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.succes_msg = req.flash('succes_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Connect to Mongo
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.log(err));

// Authentication routes
app.get('/login', checkNotAuthenticated, getLogin);
app.get('/register', checkNotAuthenticated, getRegister);
app.get('/logout', checkAuthenticated, getLogout);
app.post('/login', checkNotAuthenticated, postLogin);
app.post('/register', checkNotAuthenticated, postRegister);

// Routes
app.use('/', require('./routes/index'));
app.use('/dashboard', checkAuthenticated, require('./routes/dashboard'));
app.use('/games', require('./routes/games'));
app.use('/tournaments', setActive, require('./routes/tournaments'));

app.use('/admin', [checkAuthenticated, checkIsAdmin], require('./routes/admin'));

app.listen(process.env.PORT || 3000);
