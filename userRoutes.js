const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to fetch user details
router.get('/me', authMiddleware(['user', 'manager', 'admin']), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');  // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
