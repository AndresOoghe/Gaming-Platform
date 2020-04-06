const express = require('express');
const router = express.Router();
const db = require('../database/games');
const utilities = require('../utilities/properties');

// GET: all Games
router.get('/', (req, res) => {
    db.get()
    .then( games => {   
        res.render('games/index', utilities.setSharedProperties(req, {games}));
    })
}); 

router.get('/:name', (req, res, next) => {
    const name = req.params.name;
    console.log(name);
    db.findByName(name)
    .then( game => {
        console.log(game);
    })
})

module.exports = router;