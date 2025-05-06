const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  forgotPassword,
  verifyForgotOtp,
  resetPassword,
  getPendingUsers,
  approveUser,
  rejectUser,
  logout,
  getAllUsers,
  setUserRole,
  setPassword,
} = require("../controllers/userController");

const { authenticate, authorizeRoles } = require("../middleware/authMiddleware"); // 👈 Add this line

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post('/set-password', setPassword);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOtp);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

// Admin Routes
router.get("/pending", getPendingUsers);      // Get all pending approved users
router.post("/approve", approveUser);          // Approve a specific user
router.delete('/reject/:userId', rejectUser);


// Role-based Routes
router.get("/all", authenticate, authorizeRoles("admin", "superadmin"), getAllUsers);
router.post("/set-role", authenticate, authorizeRoles("superadmin"), setUserRole);

module.exports = router;
