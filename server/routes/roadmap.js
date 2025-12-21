const express = require('express')
const { getJobStatus } = require('../controllers/roadmapController')
const {
    generateUserRoadmap,
    getUserRoadmap,
    regenerateRoadmap,
    updateRoadmapProgress
} = require('../controllers/roadmapController')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/generate', auth, generateUserRoadmap)
router.get('/', auth, getUserRoadmap);
router.post('/regenerate', auth, regenerateRoadmap);
router.put('/progress', auth, updateRoadmapProgress);
router.get('/job/:jobId', auth, getJobStatus)
module.exports = router