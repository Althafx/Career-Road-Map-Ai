const express = require('express');
const {
    login,
    getUsers,
    deleteUser,
    getUserDetails
} = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

router.post('/login', login);
router.get('/users', adminAuth, getUsers);
router.get('/users/:id', adminAuth, getUserDetails);
router.delete('/users/:id', adminAuth, deleteUser);

module.exports = router;
