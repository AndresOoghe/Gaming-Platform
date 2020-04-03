const express = require('express');
const router = express.Router();
const Game = require('../models/game.model');

// GET: all Games
router.get('/', async (req, res) => {
    let searchOptions = {};
    if (req.query.name && req.query.name.trim() !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }

    try {
        const games = await Game.find(searchOptions);
        res.render('games/index', {
            games: games,
            searchOptions: req.query,
        });
    } catch (err) {
        res.redirect('/');
    }
});

// GET: new Game
router.get('/new', (req, res) => {
    res.render('games/new', { game: new Game() });
});

// POST: new Game
router.post('/', async (req, res) => {
    const game = new Game({
        name: req.body.name,
    });

    try {
        const newGame = await game.save();
        // res.redirect(`games/${newGame.id}`);
        res.redirect('games');
    } catch (err) {
        res.render('games/new', {
            game: game,
            errorMessage: 'Error creating Game',
        });
    }
});

module.exports = router;