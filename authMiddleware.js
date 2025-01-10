const jwt = require('jsonwebtoken');

// Middleware for authentication and role-based access
const authMiddleware = (roles) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access Denied' });
        }

        jwt.verify(token, 'rbac-secret', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid Token' });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            req.user = user; // Attach user data to the request
            next(); // Pass control to the next middleware or route handler
        });
    };
};

module.exports = authMiddleware;
