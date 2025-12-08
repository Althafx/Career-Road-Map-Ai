const express = require('express');
const {
  createAssessment,
  getAssessment,
  updateAssessment
} = require('../controllers/assessmentController');
const auth = require('../middleware/auth');
const router = express.Router();
router.post('/', auth, createAssessment);
router.get('/', auth, getAssessment);
router.put('/', auth, updateAssessment);

module.exports = router;