const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No admin token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        req.admin = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid admin token' });
    }
};

module.exports = adminAuth;
