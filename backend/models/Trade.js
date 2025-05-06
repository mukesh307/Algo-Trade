const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    id: Number,
    symbol: String,
    action: String,
    targets: [String],
    stoploss: String,
    date: Number,
    senderId: String
});

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;
