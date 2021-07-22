const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    id: { type: String, required: true },
    sessionId: { type: String, required: true },
    connected: { type: Boolean, required: true }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
