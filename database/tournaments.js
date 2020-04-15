const { Tournament } = require('../models/Tournament');

module.exports = {
    findById(id) {
        return new Promise((resolve, reject) => {
            Tournament.findById(id)
                .then(tournament => resolve(tournament))
                .catch(err => reject(err));
        });
    },
    get() {
        return find(null, null);
    },
    findByGameId(gameId) {
        return find('game', gameId);
    },
    unregister(tournamentId,  username) {
        return pull(tournamentId, 'inscriptions', username);
    }
}

const findOne = (field, value) => {
    const query = {};
    query[field] = value;
    return new Promise((resolve, reject) => {
        Tournament.findOne(query)
            .then(tournament => resolve(tournament))
            .catch(err => reject(err));
    });
};

const find = (field, value) => {
    const query = {};
    query[field] = value;
    return new Promise((resolve, reject) => {
        Tournament.find(query)
            .then(tournaments => resolve(tournaments))
            .catch(err => reject(err));
    });
};

const pull = (tournamentId, field, value) => {
    const query = {};
    query[field] = value;
    return new Promise((resolve, reject) => {
        Tournament.updateOne(
            { _id: tournamentId },
            { $pull: query }
        ).then(tournament => resolve(tournament))
            .catch(err => reject(err));
    });
}