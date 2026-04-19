const mongoose = require('mongoose');
const Comment = require('./Comment');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  image: { type: String }, // Stores the Cloudinary URL
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Force a connection to a user
  },
  status: { type: String, default: 'published' }
}, { timestamps: true });

// Cascade delete comments when a post is deleted
postSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    await Comment.deleteMany({ post: this._id });
    next();
});

module.exports = mongoose.model('Post', postSchema);