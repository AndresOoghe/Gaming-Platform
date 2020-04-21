const express = require('express');
const router = express.Router();
const db = require('../database/games');
const { setSharedProperties } = require('../utilities/properties')

router.get('/', (req, res) => {
    console.log(req.session);

    db.get()
        .then(games => {
            res.render('index', setSharedProperties(req, {games}));
        })
        .catch(err => {
            req.flash('error_msg', 'Something went wrong, please contact support if this keeps happening.');
            res.render('index');
        })
});

module.exports = router;