const express = require('express');
const router = express.Router();
const dbGames = require('../database/games');
const dbTournaments = require('../database/tournaments');
const { setSharedProperties } = require('../utilities/properties');
const { checkAuthenticated } = require('../middleware/auth');


router.get('/', (req, res) => {
    const name = req.query.game;
    if (!name) {
        return res.redirect('/');
    }

    dbGames.findByName(name)
        .then(game => {
            dbTournaments.findByGameId(game._id)
                .then(tournaments => {
                    res.render('tournaments/index', setSharedProperties(req, { game, tournaments }));
                })
        })
        .catch(err => {
            req.flash('error_msg', 'The requested tournament could not be found.');
            res.redirect('/');
        })
});

router.get('/:tournament_id', (req, res) => {
    const tournamentId = req.params.tournament_id;
    dbTournaments.findById(tournamentId)
        .then(tournament => {
            res.render('tournaments/detail', setSharedProperties(req, { tournament }))
        });
});

router.post('/:tournament_id/register', checkAuthenticated, (req, res) => {
    const user = req.user;
    const tournamentId = req.params.tournament_id;

    dbTournaments.findById(tournamentId)
        .then(tournament => {
            if (tournament.inscriptions.includes(user.username)) {
                req.flash('error_msg', 'You already registered for this tournament.');
                res.redirect("back");
            } else {
                tournament.inscriptions.push(user.username);
                tournament.save()
                    .then(tournament => {
                        req.flash(
                            'succes_msg',
                            'You succesfully registered for this tournament.',
                        );
                        res.redirect("back");
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash(
                            'error_msg',
                            'Something went wrong registering for this tournament. Please contact support.',
                        );
                        res.redirect("back");
                    });
                ;
            }
        })

});

router.post('/:tournament_id/unregister', checkAuthenticated, (req, res) => {
    const user = req.user;
    const tournamentId = req.params.tournament_id;

    dbTournaments.findById(tournamentId)
        .then(tournament => {
            if (!tournament.inscriptions.includes(user.username)) {
                req.flash('error_msg', 'You are not registered for this tournament.');
                res.redirect("back");
            } else {
                dbTournaments.unregister(tournamentId, user.username)
                    .then(response => {
                        if (response.ok) {
                            req.flash(
                                'succes_msg',
                                'You succesfully unregistered for this tournament.',
                            );
                            res.redirect("back");
                        } else {
                            req.flash(
                                'succes_msg',
                                'Something went wrong unregistering for this tournament. Please contact support.',
                            );
                            res.redirect("back");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash(
                            'succes_msg',
                            'Something went wrong unregistering for this tournament. Please contact support.',
                        );
                        res.redirect("back");
                    });
            }
        });    
});

module.exports = router;