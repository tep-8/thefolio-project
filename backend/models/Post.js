const mongoose = require('mongoose');
const Comment = require('./Comment');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  image: { type: String }, // Stores the filename from Multer
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'published' }
}, { timestamps: true });

postSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    await Comment.deleteMany({ post: this._id });
    next();
});

module.exports = mongoose.model('Post', postSchema);