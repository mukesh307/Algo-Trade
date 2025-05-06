const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const User = require("../models/TelegramUser");
const Channel = require('../models/Channel');
const Trade = require('../models/Trade');
const { exit } = require("process");

require("dotenv").config();

const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

const getUserChannels = async (req, res) => {
    const { phone } = req.params;
    try {
        const user = await User.findOne({ phone });
        if (!user || !user.telegramAuth) {
            return res.status(400).json({ message: "User not authenticated or no Telegram session found" });
        }

        const client = new TelegramClient(new StringSession(user.telegramAuth), apiId, apiHash, { connectionRetries: 5 });
        await client.connect();

        const dialogs = await client.getDialogs();
        const channelsAndGroups = dialogs.filter(dialog => dialog.isChannel || dialog.isGroup).map(dialog => ({
            id: dialog.id,
            title: dialog.title,
            type: dialog.isChannel ? "Channel" : "Group"
        }));

        res.status(200).json({ channelsAndGroups });
    } catch (error) {
        console.error("Error fetching channels/groups:", error);
        res.status(500).json({ message: "Failed to fetch channels and groups", error: error.message });
    }
};

const connectToChannel = async (req, res) => {
    const { userPhone, channelId } = req.body;
    try {
        const user = await User.findOne({ phone: userPhone });
        if (!user || !user.telegramAuth) {
            return res.status(400).json({ message: "User not authenticated or no Telegram session found" });
        }

        const client = new TelegramClient(new StringSession(user.telegramAuth), apiId, apiHash, { connectionRetries: 5 });
        await client.connect();

        const channel = await client.getEntity(channelId);
        // await client.sendMessage(channel, { message: "Hello from the bot!" });

        res.status(200).json({ message: "Connected to channel", channel });
    } catch (error) {
        console.error("Error connecting to channel:", error);
        res.status(500).json({ message: "Failed to connect to channel", error: error.message });
    }
};


const disconnectChannel = async (req, res) => {
    const { userPhone, channelId } = req.body;
    try {
        const deletedConfig = await Channel.findOneAndDelete({ userPhone, channelId });
        if (!deletedConfig) {
            return res.status(404).json({ success: false, message: "No such configuration found to disconnect" });
        }
        res.status(200).json({ success: true, message: "Channel disconnected successfully" });
    } catch (error) {
        console.error("Error disconnecting channel:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};



const selectChannel = async (req, res) => {
    const { userPhone, channelId, channelName, keyword } = req.body;
    try {
        const newChannel = new Channel({ userPhone, channelId, channelName, keyword, status: "pending" });
        await newChannel.save();
        res.status(201).json({ message: "Configuration sent for approval" });
    } catch (error) {
        console.error("Error configuring channel:", error);
        res.status(500).json({ message: "Failed to configure channel", error: error.message });
    }
};

// 🏷️ **Symbol Extract करने का फंक्शन**
function extractSymbol(text) {
    const match = text.match(/#(\w+)/);  // #BTCUSD, #XAUUSD जैसा फॉर्मेट पकड़ने के लिए
    return match ? match[1] : "Unknown";
  }
  
  // 📌 **Buy/Sell Extract करने का फंक्शन**
  function extractAction(text) {
    return text.includes("Buy") ? "Buy" : text.includes("Sell") ? "Sell" : "Unknown";
  }
  
  // 🎯 **Targets Extract करने का फंक्शन**
  function extractTargets(text) {
    const match = text.match(/Target\s*\d\s*:\s*([\d]+)/g);
    return match ? match.map(t => t.split(":")[1].trim()) : [];
  }
  
  // ❗ **Stoploss Extract करने का फंक्शन**
  function extractStoploss(text) {
    const match = text.match(/Stoploss\s*:\s*([\d]+)/);
    return match ? match[1] : "Unknown";
  }
  async function extractTradeDetails(messages) {
    return messages.map(msg => {
        const messageText = msg.message;
        const extractedTargets = extractTargets(messageText);  
        return {
            id: msg.id,
            symbol: extractSymbol(messageText),
            action: extractAction(messageText),
            targets: extractedTargets.length > 0 ? extractedTargets.join(" | ") : "",
            stoploss: extractStoploss(messageText),
            date: msg.date,
            senderId: msg.senderId
        };
    });
  }
  

async function getApprovedMessages(channelId) {
    try {
        if (!channelId) throw new Error("Channel ID is required");

        const approvedChannels = await Channel.find({ channelId, status: "approved" });
        if (!approvedChannels.length) return [];

        const keywords = approvedChannels.map(c => c.keyword.toLowerCase());
        const user = await User.findOne({ phone: approvedChannels[0].userPhone });

        if (!user || !user.telegramAuth) throw new Error("User auth not found");

        const client = new TelegramClient(new StringSession(user.telegramAuth), apiId, apiHash, { connectionRetries: 5 });
        await client.connect();

        const channel = await client.getEntity(channelId);
        const messages = await client.getMessages(channel, { limit: 20 });
       
        return messages.filter(msg => {
            const text = msg.message?.toLowerCase() || "";
            return keywords.some(k => text.includes(k));
        });
    } catch (error) {
        console.error("Error in getApprovedMessages:", error);
        return [];
    }
}

const getPendingRequests = async (req, res) => {
    try {
        const requests = await Channel.find({ status: "pending" });
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({ message: "Failed to fetch requests", error: error.message });
    }
};

const approveRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await Channel.findByIdAndUpdate(id, { status: "approved" }, { new: true });
        if (!updated) return res.status(404).json({ message: "Request not found" });
        res.status(200).json({ message: "Approved" });
    } catch (error) {
        res.status(500).json({ message: "Approval failed", error: error.message });
    }
};

const rejectChannelRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Channel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Request not found" });
        res.status(200).json({ message: "Rejected" });
    } catch (error) {
        res.status(500).json({ message: "Rejection failed", error: error.message });
    }
};

const fetchAndSaveApprovedMessages = async (req, res) => {
    try {
        const channelId = req.query.channelId;
        if (!channelId) return res.status(400).json({ success: false, error: 'Channel ID is required!' });

        const messages = await getApprovedMessages(channelId);
        if (!messages || messages.length === 0) return res.status(400).json({ success: false, error: 'No messages found for approved keywords!' });

        const extracted = await extractTradeDetails(messages);
        const validTrades = extracted.filter(t => t.symbol !== 'Unknown' && t.action !== 'Unknown');

        if (!validTrades.length) return res.status(400).json({ success: false, error: 'No valid trade messages to save!' });

        await Trade.insertMany(validTrades);
        res.json({ success: true, messages: validTrades });
    } catch (error) {
        console.error("Error saving approved messages:", error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = {
    getUserChannels,
    selectChannel,
    getPendingRequests,
    approveRequest,
    rejectChannelRequest,
    connectToChannel,
    extractTradeDetails,
    getApprovedMessages,
    fetchAndSaveApprovedMessages,
    disconnectChannel
};



