//backend/models/User.js
// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Not 'bcrypt'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' }, // stores filename e.g. 'abc123.jpg'
}, { timestamps: true }); // adds createdAt and updatedAt automatically

// ── Pre-save hook: hash password before storing ────────────────
// NEW WAY (Fixed)
// backend/models/User.js

// --- Pre-save hook: hash password before storing ---
userSchema.pre('save', async function () {
  // 1. Only run this if the password was actually changed
  if (!this.isModified('password')) {
    return; // Just return, no 'next()' needed for async hooks
  }

  try {
    const salt = await bcrypt.genSalt(10);
    // 2. Hash the plain text password
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw new Error(err); // Mongoose catches this as a save error
  }
});

// ── Instance method: compare entered password with stored hash ─
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    throw new Error("Password hash not found in the user object. Did you forget to .select('+password')?");
  }
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);