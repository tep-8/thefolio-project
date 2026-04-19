const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await Message.create({ name, email, message });
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    res.status(500).json({ message: "Failed to save message." });
  }
});

module.exports = router;