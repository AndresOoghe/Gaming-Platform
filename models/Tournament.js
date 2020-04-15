const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    inscriptions: [{ type: String }]
})

const Tournament = mongoose.model('Tournament', tournamentSchema);

exports.Tournament = Tournament;