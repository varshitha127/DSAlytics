const express = require('express');
const router = express.Router();
const userStudyPlanController = require('../controllers/userStudyPlanController');
const auth = require('../middleware/auth');

// Static routes FIRST
router.get('/analytics/summary', auth.authenticateToken, userStudyPlanController.getUserAnalytics);
router.post('/custom', auth.authenticateToken, userStudyPlanController.createCustomPlan);
router.put('/custom/:planId', auth.authenticateToken, userStudyPlanController.updateCustomPlan);
router.delete('/custom/:planId', auth.authenticateToken, userStudyPlanController.deleteCustomPlan);
router.post('/join-group', auth.authenticateToken, userStudyPlanController.joinGroupPlan);
router.post('/:planId/share', auth.authenticateToken, userStudyPlanController.sharePlan);

// Main user study plan routes
router.get('/', auth.authenticateToken, userStudyPlanController.getAllUserStudyPlans);
router.get('/:planId', auth.authenticateToken, userStudyPlanController.getOrCreateUserStudyPlan);
router.patch('/:planId/topics/:topicId', auth.authenticateToken, userStudyPlanController.updateTopicProgress);
router.patch('/:planId', auth.authenticateToken, userStudyPlanController.updatePlanProgress);

module.exports = router; 