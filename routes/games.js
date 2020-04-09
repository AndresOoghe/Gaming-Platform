const express = require('express');
const router = express.Router();
const db = require('../database/games');
const { setSharedProperties } = require('../utilities/properties');

// GET: all Games
router.get('/', (req, res) => {
    db.get()
        .then(games => {
            res.render('games/index', setSharedProperties(req, { games }));
        })
});

router.get('/:name', (req, res, next) => {
    const name = req.params.name;
    db.findByName(name)
        .then(game => {
            res.render('games/detail', setSharedProperties(req, { game }));
        })
})

module.exports = router;