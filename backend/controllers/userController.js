const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const sendEmail = require("../utils/sendEmail");
const {sendSMS} = require("../utils/sendSMS");
const generateToken = require("../utils/generateToken");

const generateOTP = () => Math.floor(100 + Math.random() * 900).toString();

exports.register = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const emailOTP = generateOTP();
    const smsOTP = generateOTP();

    const user = await User.create({
      name, email, phone,
      emailOTP, smsOTP
    });

    await sendEmail(email, emailOTP);
    await sendSMS(phone, smsOTP);

    res.status(201).json({ message: "OTP sent to email and SMS", userId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { userId, emailOTP, smsOTP } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.emailOTP === emailOTP && user.smsOTP === smsOTP) {
      user.isVerified = true;        // ✅ Mark as verified
      user.emailOTP = null;          // Clear OTPs
      user.smsOTP = null;

      await user.save();

      res.json({ 
        message: "OTP verified successfully. Awaiting admin approval." 
      });
    } else {
      res.status(400).json({ message: "Invalid OTPs" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set user password after OTP verification
exports.setPassword = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: "User ID and password are required" });
  }

  // Proceed with setting the password
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds (higher = more secure)

    // Update password with the hashed value
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password created successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// Get all pending users
exports.getPendingUsers = async (req, res) => {
  const users = await User.find({ isVerified: true, isApproved: false });
  res.json(users);
};

// Approve user
exports.approveUser = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isApproved = true;
  await user.save();

  res.json({ message: "User approved successfully" });
};


exports.rejectUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // User ko delete kar rahe hain (yaha puri tarah se delete karenge)
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User rejected and deleted successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting and deleting user" });
  }
};




exports.login = async (req, res) => {
  const { emailOrPhone, password } = req.body;  // emailOrPhone use karenge

  try {
    // Email ya phone ke through user ko dhoondhna
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] // Match email or phone
    });

    // Agar user nahi mila ya password match nahi hota
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or phone or password" });
    }

    // Agar user verify aur approved nahi hai to login nahi hoga
    if (!user.isVerified) {
      return res.status(403).json({ message: "Account not verified" });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: "Account not approved by admin" });
    }

    // Token generate karna
    const token = generateToken(user);

    // Token ko cookie me set karna
    res.cookie("token", token, {
      httpOnly: true, // Cookie sirf server ke through access ho sakti hai
      secure: process.env.NODE_ENV === "production", // Production me secure cookie
      maxAge: 24 * 60 * 60 * 1000, // Cookie ka expiry time: 1 din
    });

    // Login successful hone par response bhejna
    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, phone: user.phone }, // Response me email aur phone dono bhej sakte hain
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set up the email transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});


// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.emailOTP = otp;  // ✅ Fix casing
  await user.save();

  // Send OTP to email
  await transporter.sendMail({
    from: '"Auth App" <your-email@gmail.com>',
    to: user.email,
    subject: "Forgot Password OTP",
    text: `Your OTP is ${otp}`,
  });

  console.log("Generated OTP:", otp); // 👀 Debug log
  res.json({ message: "OTP sent to email", userId: user._id });
};

// Verify OTP for password reset
exports.verifyForgotOtp = async (req, res) => {
  const { userId, emailOtp } = req.body;
  const user = await User.findById(userId);
  console.log("Entered OTP:", emailOtp);
  console.log("Stored OTP:", user?.emailOTP); // ✅ Fix casing

  if (!user || user.emailOTP !== emailOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.json({ message: "OTP verified" });
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.emailOTP = null; // ✅ Also fix casing here
  await user.save();

  res.json({ message: "Password reset successful" });
};


exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};




exports.setUserRole = async (req, res) => {
  const { userId, role } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();

  res.json({ message: "User role updated", user });
};


exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};







