const mongoose = require('mongoose');

const FailedLoginSchema = new mongoose.Schema({
    email: String,
    reason: String,
    attempts: { type: Number, default: 0 },
    lockedUntil: Date
});

module.exports = mongoose.model('FailedLogin', FailedLoginSchema);
