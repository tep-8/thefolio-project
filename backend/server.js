// backend/server.js
require('dotenv').config(); // Load .env variables FIRST
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config(); 


// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');


const app = express();

app.use(cors()); // This allows React to talk to Node!
app.use(express.json()); // This allows Node to read your login email/password

// Connect to MongoDB
connectDB();

// ── Middleware ─────────────────────────────────────────────────

// Allow React (port 3000) to call this server
app.use(cors({
origin:[
'http://localhost:3000',
'https://thefolio.vercel.app', // ←your Vercel URL (update afterdeployment)
],
credentials:true,
}));

// Parse incoming JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded image files as public URLs
// e.g. http://localhost:5000/uploads/my-image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);     // Use the variables you imported at the top
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// FIX: Only use user.routes for the /api/users prefix
app.use('/api/users', userRoutes);

// ── Start Server ──────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`******************************************`);
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`******************************************`);
});