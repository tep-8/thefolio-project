const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth.middleware');
const router = express.Router();

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ── POST /api/auth/register ───────────────────────────────────
// Creates a new member account
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  console.log("Registering user:", email); // See if data arrived

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Use .create() - this triggers the Schema.pre('save') hook
    const user = await User.create({ 
      name, 
      email, 
      password // Plain text here, User.js hashes it!
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("DETAILED REGISTRATION ERROR:", err); // CHECK TERMINAL FOR THIS
    res.status(500).json({ message: "Registration failed: " + err.message });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
// Authenticates user and returns a token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // FORCE fetch the password hash and the status
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      
      // --- ADD THIS BLOCK HERE ---
      // Check if the user's account is inactive
      if (user.status === 'inactive') {
        return res.status(403).json({ 
          message: 'This account has been deactivated. Please contact the administrator.' 
        });
      }
      // ---------------------------

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
// Returns current logged-in user data (Used for refreshing the app state)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // Kick them out if they are inactive
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account deactivated.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;