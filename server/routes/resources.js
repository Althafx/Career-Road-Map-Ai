const express = require('express');
const {
    getResourcesForSkills,
    getResourcesByType,
    addResource
} = require('../controllers/resourceController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get resources for specific skills (main endpoint)
router.get('/', auth, getResourcesForSkills);

// Get resources by type (videos, docs, etc.)
router.get('/by-type', auth, getResourcesByType);

// Admin: Add new resource
router.post('/', auth, addResource);

module.exports = router;
