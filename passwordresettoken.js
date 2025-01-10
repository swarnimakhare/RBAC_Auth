const mongoose = require('mongoose');

const PasswordResetTokenSchema = new mongoose.Schema({
    email: String,
    token: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);
