const { Game } = require('../models/Game');

module.exports = {
    get() {
        return createPromise(null, null, false);
    },
    findByName(name) {
        return createPromise('name', name);
    }
}

const createPromise = (field, value, one = true) => {
    const query = {};
    query[field] = value;
    if (one) {
        return new Promise((resolve, reject) => {
            Game.findOne(query)
                .then(game => resolve(game))
                .catch(err => reject(err));
        });
    }
    return new Promise((resolve, reject) => {
        Game.find(query)
            .then(games => resolve(games))
            .catch(err => reject(err));
    });
}
