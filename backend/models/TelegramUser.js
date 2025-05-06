const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    telegramAuth: { type: Object, default: null }
});

module.exports = mongoose.model('TelegramUser', UserSchema);
