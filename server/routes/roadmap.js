const express = require('express')
const {
    generateUserRoadmap,
    getUserRoadmap,
    regenerateRoadmap
} = require('../controllers/roadmapController')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/generate', auth, generateUserRoadmap)
router.get('/', auth, getUserRoadmap);
router.post('/regenerate', auth, regenerateRoadmap);

module.exports = router