const mongoose = require('mongoose');

const { Schema } = mongoose;

const STATUSES = {
    pending: 'pending',
    active: 'active',
    finished: 'finished'
};

const GameSchema = new Schema({
    id: { type: String, required: true },
    roomId: { type: String, required: true },
    players: [{
        _id: Schema.Types.ObjectId,
        id: String,
        username: String,
        isInRoom: Boolean
    }],
    status: {
        type: String,
        enum: ['pending', 'active', 'finished'],
        required: true
    }
});

GameSchema.methods.removePlayer = function (id) {
    this.players.pull({ id });
    return this.save();
};

GameSchema.statics.getActiveNumber = function () {
    return this.countDocuments({ status: { $in: [STATUSES.pending, STATUSES.active] } });
};

GameSchema.statics.isUserInGame = function (id) {
    return this.findOne({ 'players.id': id }).where({ status: { $in: [STATUSES.pending, STATUSES.active] } });
};

const Game = mongoose.model('Game', GameSchema);

module.exports = {
    Game,
    STATUSES
};
