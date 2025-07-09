const express = require('express');
const router = express.Router();
const studyPlanController = require('../controllers/studyPlanController');

// Get all study plans
router.get('/', studyPlanController.getAllStudyPlans);

// Get a single study plan by ID
router.get('/:id', studyPlanController.getStudyPlanById);

// Create a new study plan
router.post('/', studyPlanController.createStudyPlan);

module.exports = router; 