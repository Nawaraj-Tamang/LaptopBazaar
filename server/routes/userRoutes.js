const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

function generateToken(id){
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else res.status(400).json({ message: 'Invalid user data' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({
      _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else res.status(401).json({ message: 'Invalid email or password' });
});

// Profile (protected)
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
