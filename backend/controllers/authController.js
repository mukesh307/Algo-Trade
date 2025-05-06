const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram"); 
const User = require("../models/TelegramUser");
require("dotenv").config();


const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

exports.sendOtp = async (req, res) => {
    const { phone } = req.body;

    try {
        let user = await User.findOne({ phone });

        // Step 1: Check for existing session
        if (user && user.telegramAuth) {
            const client = new TelegramClient(new StringSession(user.telegramAuth), apiId, apiHash, {
                connectionRetries: 5,
            });

            try {
                await client.connect();
                const me = await client.getMe(); // this will fail if session is invalid
                console.log("Existing session is still valid for:", me.username || phone);
                return res.status(200).json({ message: "User already authenticated", user });
            } catch (error) {
                console.log("⚠️ Session expired or terminated for", phone);
                user.telegramAuth = null;
                await user.save();
                // Proceed to fresh login below
            }
        }

        // Step 2: Start fresh OTP process
        const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
            connectionRetries: 5,
        });

        await client.start({
            phoneNumber: phone,
            phoneCode: async () => {
                return new Promise((resolve) => {
                    process.stdout.write("Enter the OTP received on Telegram: ");
                    process.stdin.once("data", (data) => {
                        resolve(data.toString().trim());
                    });
                });
            },
            onError: (err) => console.log("OTP Error:", err),
        });

        const sessionString = client.session.save();

        if (!user) {
            user = new User({ phone, telegramAuth: sessionString });
        } else {
            user.telegramAuth = sessionString;
        }

        await user.save();

        res.status(200).json({ message: "User authenticated with Telegram", user });

    } catch (error) {
        console.error("❌ Error in OTP verification:", error);
        res.status(500).json({ message: "OTP verification failed", error: error.message });
    }
};


// 🔹 Logout (Terminate Session)
exports.logoutUser = async (req, res) => {
    const { phone } = req.body;
  
    try {
      const user = await User.findOne({ phone });
  
      if (!user || !user.telegramAuth) {
        return res.status(400).json({ message: "No session found for this user" });
      }
  
      const client = new TelegramClient(
        new StringSession(user.telegramAuth),
        apiId,
        apiHash,
        { connectionRetries: 5 }
      );
  
      await client.connect();
  
      // ✅ Telegram logout using MTProto
      await client.invoke(new Api.auth.LogOut());
  
      // Disconnect client and remove session
      await client.disconnect();
      user.telegramAuth = null;
      await user.save();
  
      res.status(200).json({ message: "Logged out and session terminated successfully" });
    } catch (error) {
      console.error("Logout failed:", error);
      res.status(500).json({ message: "Logout failed", error: error.message });
    }
  };
  
