const express = require('express');
const router = express.Router();

const { register, login, logout, getUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getUser); // ✅ Requires token/cookie

// Test route to verify connection
router.get('/test', (req, res) => {
  res.send('Login route is reachable');
});

module.exports = router;
