const StudyPlan = require('../models/StudyPlan');

// Get all study plans
exports.getAllStudyPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch study plans' });
  }
};

// Get a single study plan by ID
exports.getStudyPlanById = async (req, res) => {
  try {
    const plan = await StudyPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Study plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch study plan' });
  }
};

// Create a new study plan
exports.createStudyPlan = async (req, res) => {
  try {
    const plan = new StudyPlan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create study plan' });
  }
}; 