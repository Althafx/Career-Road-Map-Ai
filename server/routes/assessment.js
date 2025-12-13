const express = require('express');
const {
  createAssessment,
  getAssessment,
  deleteAssessment
} = require('../controllers/assessmentController');
const auth = require('../middleware/auth');
const router = express.Router();
router.post('/', auth, createAssessment);
router.get('/', auth, getAssessment);
router.delete('/:id', auth, deleteAssessment);

module.exports = router;