const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: String,
  emailOTP: String,
  smsOTP: String,
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false }, 
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
