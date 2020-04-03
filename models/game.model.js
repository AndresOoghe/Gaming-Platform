const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    }
})

module.exports = mongoose.model('Game', gameSchema);