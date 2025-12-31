const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Roadmap = require('../models/Roadmap');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
        return res.status(500).json({ message: 'Admin credentials not configured in server' });
    }

    if (username === adminUser && password === adminPass) {
        const token = jwt.sign(
            { id: 'admin', isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            success: true,
            token,
            user: { name: 'System Administrator', email: adminUser }
        });
    }

    res.status(401).json({ message: 'Invalid admin credentials' });
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete all roadmaps for this user
        await Roadmap.deleteMany({ user: id });

        // Delete the user
        await User.findByIdAndDelete(id);

        res.json({ success: true, message: 'User and all associated data deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id, '-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const roadmaps = await Roadmap.find({ user: id });

        res.json({
            success: true,
            user,
            roadmaps
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user details', error: error.message });
    }
};
