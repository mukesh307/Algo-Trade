// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');

// Admin Dashboard Route
router.get('/dashboard', isAuthenticated, isAdmin, (req, res) => {
  res.json({ message: 'Welcome to admin dashboard' });
});

module.exports = router;
