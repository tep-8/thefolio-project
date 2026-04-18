const express = require('express');
const router = express.Router();
const User = require('../models/User');
const protect = require('../middleware/auth.middleware');
const bcrypt = require('bcryptjs');
const upload = require('../middleware/upload.middleware.js');

// PUT /api/users/profile — Update Name, Bio, and Profile Pic
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            
            if (req.file) {
                // IMPORTANT: Cloudinary gives us the URL in .path
                // This will look like: https://res.cloudinary.com/...
                user.profilePic = req.file.path; 
            }

            const updatedUser = await user.save();
            
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                bio: updatedUser.bio,
                profilePic: updatedUser.profilePic, // Now a full link!
                token: req.headers.authorization.split(' ')[1]
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/change-password', protect, async (req, res) => {
  console.log("--- Password Change Attempt Started ---");
  try {
    const { oldPassword, newPassword } = req.body;

    // 1. Fetch User + Password
    const user = await User.findById(req.user._id).select('+password');
    console.log("User found in DB:", !!user);

    if (!user || !user.password) {
      console.log("Error: User or Password hash missing.");
      return res.status(404).json({ message: "User security data not found." });
    }

    // 2. Direct Comparison
    console.log("Comparing passwords...");
    const isMatch = await bcrypt.compare(String(oldPassword), String(user.password));
    console.log("Is match?:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // 3. Update
    user.password = newPassword; 
    await user.save();
    console.log("Password saved successfully!");

    res.json({ message: "Password updated successfully! ✦" });

  } catch (err) {
    console.error("DETAILED ROUTE ERROR:", err); // THIS PRINTS TO YOUR TERMINAL
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});
module.exports = router;