const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment'); // Added this
const protect = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware.js');

const router = express.Router();

// ==========================================
// POST ROUTES
// ==========================================

// GET /api/posts — Public: all published posts (newest first)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'published' })
            .populate('author', 'name profilePic')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/posts/:id — Public: single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name profilePic');
        if (!post || post.status === 'removed') {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/posts — Member or Admin: create new post
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        // 1. REMOVED the "Only Admin" check here so members can upload too
        
        const { title, content, category } = req.body; 

        // 2. CHANGE: Use req.file.path (the Cloudinary URL) instead of .filename
        const image = req.file ? req.file.path : '';

        if (!title || !content) {
            return res.status(400).json({ message: "Title and Content are required." });
        }

        const post = await Post.create({ 
            title, 
            content, 
            category,
            image, // This is now a full https URL
            author: req.user._id 
        });

        const populatedPost = await Post.findById(post._id).populate('author', 'name profilePic');
        res.status(201).json(populatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/posts/:id — Edit: only post owner OR admin
// PUT /api/posts/:id — Edit: only post owner OR admin
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const isOwner = post.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // 3. REMOVED the "Only Admin" check for editing images
        
        if (req.body.title) post.title = req.body.title;
        if (req.body.content) post.content = req.body.content;
        if (req.body.category) post.category = req.body.category; 
        
        // 4. CHANGE: Use req.file.path for the update
        if (req.file) post.image = req.file.path;

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/posts/:id — Delete: only post owner OR admin
// DELETE /api/posts/:id
// DELETE /api/posts/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 1. Check if the author exists at all to prevent .toString() crash
        if (!post.author) {
            // If post has no author, only allow Admins to delete it
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Orphaned post: Only admins can remove this.' });
            }
        } else {
            // 2. Normal ownership check with Optional Chaining
            const isOwner = post.author?.toString() === req.user?._id?.toString();
            const isAdmin = req.user?.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json({ message: 'Not authorized to delete this story.' });
            }
        }

        // 3. Use findByIdAndDelete to ensure it bypasses any broken middleware hooks
        await Post.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        // LOOK AT YOUR BACKEND TERMINAL FOR THIS:
        console.error("CRITICAL DELETE ERROR:", err); 
        res.status(500).json({ message: "Server error during deletion", error: err.message });
    }
});

// ==========================================
// COMMENT / REPLY ROUTES (NEWLY IMPLEMENTED)
// ==========================================

// POST /api/posts/:id/comments — Add a reply
router.post('/:id/comments', protect, async (req, res) => {
    try {
        const comment = await Comment.create({
            body: req.body.body, // Match your model's "body" field
            post: req.params.id,
            author: req.user._id
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'name profilePic');

        res.status(201).json(populatedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/posts/:id/comments — Get all replies for a post
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
            .populate('author', 'name profilePic')
            .sort({ createdAt: -1 }); // Newest first
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/posts/comments/:commentId — Delete a reply (Owner or Admin)
router.delete('/comments/:commentId', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const isAuthor = comment.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (isAuthor || isAdmin) {
            await comment.deleteOne();
            res.json({ message: 'Comment removed' });
        } else {
            res.status(403).json({ message: 'Not authorized' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;