const express = require('express');
const { sendOtp ,verifyOtp ,logoutUser} = require('../controllers/authController');
const router = express.Router();

router.post('/send-otp', sendOtp);
// router.post("/verify-otp",verifyOtp);
router.post('/logout', logoutUser);


module.exports = router;
