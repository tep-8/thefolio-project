const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// 1. POST /api/messages (Send a message)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await Message.create({ name, email, message });
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    res.status(500).json({ message: "Failed to save message." });
  }
});

// 2. NEW: GET /api/messages (Read all messages for Admin)
router.get('/', async (req, res) => {
  try {
    // Sort by createdAt: -1 to see the newest messages first
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages." });
  }
});

// 3. NEW: DELETE /api/messages/:id (Remove a message)
router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message." });
  }
});

module.exports = router;