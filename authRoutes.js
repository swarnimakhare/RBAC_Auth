const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const FailedLogin = require('../models/failedlogin');
const PasswordResetToken = require('../models/passwordresettoken');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Sign up route
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });

        // Try to save the user
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Handle duplicate email error (MongoDB duplicate key error)
        if (error.code === 11000) {
            res.status(400).json({ message: 'User already found' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});


// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const failedLogin = await FailedLogin.findOne({ email });

    if (failedLogin && failedLogin.lockedUntil && new Date() < failedLogin.lockedUntil) {
        return res.status(403).json({ message: 'Account locked. Try again later.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            await FailedLogin.updateOne({ email }, {
                $set: { reason: 'User not found' },
                $inc: { attempts: 1 },
                $setOnInsert: { email }
            }, { upsert: true });
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            await FailedLogin.updateOne({ email }, {
                $set: { reason: 'Invalid credentials' },
                $inc: { attempts: 1 },
                $setOnInsert: { email }
            }, { upsert: true });

            const updatedFailedLogin = await FailedLogin.findOne({ email });
            if (updatedFailedLogin.attempts >= 3) {
                updatedFailedLogin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
                await updatedFailedLogin.save();
                return res.status(403).json({ message: 'Account locked due to multiple failed attempts' });
            }

            return res.status(403).json({ message: 'Invalid credentials' });
        }

        await FailedLogin.deleteOne({ email });
        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, 'rbac-secret', { expiresIn: '1h' });
        res.json({ message: `Welcome ${user.role}, ${user.name}`, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = Math.random().toString(36).substring(2, 15);
    const resetToken = new PasswordResetToken({ email, token });
    await resetToken.save();

    // Simulate sending email
    console.log(`Password reset token for ${email}: ${token}`);

    res.json({ message: 'Password reset link sent to email' });
});

module.exports = router;
