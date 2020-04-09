const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    short_name: {
        type: String,
        required: true,
    }
})

const Game = mongoose.model('Game', gameSchema);

exports.Game = Game;
// exports.validate = validateUser;