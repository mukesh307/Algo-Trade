const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    userPhone: { type: String, required: true },
    channelId: { type: String, required: true },
    channelName: { type: String, required: true },
    keyword: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true }); // ✅ Add this line to enable createdAt & updatedAt

module.exports = mongoose.model('Channel', ChannelSchema);
