// backend/middleware/role.middleware.js

// Only admins can pass
const adminOnly = (req, res, next) => {
    // Space added after 'if' and around '&&'
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    // Space added after 'return'
    return res.status(403).json({ message: 'Access denied — Admins only' });
};

// Members or Admins can pass (but not guests/unauthenticated users)
const memberOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'member' || req.user.role === 'admin')) {
        return next(); // Space added after 'return'
    }
    return res.status(403).json({ message: 'Access denied — Members only' });
};

// Space added after 'module.exports =' and inside the curly braces
module.exports = { adminOnly, memberOrAdmin };