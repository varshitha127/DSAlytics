const UserStudyPlan = require('../models/UserStudyPlan');
const StudyPlan = require('../models/StudyPlan');
const User = require('../models/User');
const Group = require('../models/Group');

// Get all user study plans for the logged-in user
exports.getAllUserStudyPlans = async (req, res) => {
  try {
    const plans = await UserStudyPlan.find({ userId: req.user.id }).populate('studyPlanId');
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user study plans' });
  }
};

// Get or create a user study plan for a specific plan
exports.getOrCreateUserStudyPlan = async (req, res) => {
  try {
    let userPlan = await UserStudyPlan.findOne({ userId: req.user.id, studyPlanId: req.params.planId });
    if (!userPlan) {
      // Get the study plan topics
      const studyPlan = await StudyPlan.findById(req.params.planId);
      if (!studyPlan) return res.status(404).json({ message: 'Study plan not found' });
      userPlan = new UserStudyPlan({
        userId: req.user.id,
        studyPlanId: req.params.planId,
        topicsProgress: studyPlan.topics.map(topic => ({ topicId: topic._id, status: 'not-started' }))
      });
      await userPlan.save();
    }
    res.json(userPlan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch or create user study plan' });
  }
};

// Update topic progress
exports.updateTopicProgress = async (req, res) => {
  try {
    const { planId, topicId } = req.params;
    const { status } = req.body;
    let userPlan = await UserStudyPlan.findOne({ userId: req.user.id, studyPlanId: planId });
    if (!userPlan) return res.status(404).json({ message: 'User study plan not found' });
    const topic = userPlan.topicsProgress.find(t => t.topicId.toString() === topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found in user plan' });
    topic.status = status;
    if (status === 'completed') {
      topic.completedAt = new Date();
    } else {
      topic.completedAt = undefined;
    }
    userPlan.lastActivityAt = new Date();
    // Recalculate progress
    const completed = userPlan.topicsProgress.filter(t => t.status === 'completed').length;
    userPlan.progress = Math.round((completed / userPlan.topicsProgress.length) * 100);
    // Update plan status
    if (completed === userPlan.topicsProgress.length) {
      userPlan.status = 'completed';
      userPlan.completedAt = new Date();
    } else if (completed > 0) {
      userPlan.status = 'in-progress';
      if (!userPlan.startedAt) userPlan.startedAt = new Date();
    } else {
      userPlan.status = 'not-started';
    }
    await userPlan.save();
    res.json(userPlan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update topic progress' });
  }
};

// Update overall plan status/progress (optional, e.g., for marking as started/completed directly)
exports.updatePlanProgress = async (req, res) => {
  try {
    const { planId } = req.params;
    const { status, progress } = req.body;
    let userPlan = await UserStudyPlan.findOne({ userId: req.user.id, studyPlanId: planId });
    if (!userPlan) return res.status(404).json({ message: 'User study plan not found' });
    if (status) userPlan.status = status;
    if (progress !== undefined) userPlan.progress = progress;
    await userPlan.save();
    res.json(userPlan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update plan progress' });
  }
};

// Analytics endpoint: streak, topics completed today, total completed, etc.
exports.getUserAnalytics = async (req, res) => {
  // If using the fake user, return mock analytics
  if (req.user && (req.user.id === 'fake-user-id' || req.user._id === 'fake-user-id')) {
    return res.json({
      totalCompleted: 5,
      completedToday: 1,
      streak: 3
    });
  }
  try {
    const userPlans = await UserStudyPlan.find({ userId: req.user.id });
    let totalCompleted = 0;
    let completedToday = 0;
    let streak = 0;
    let lastDay = null;
    const today = new Date();
    today.setHours(0,0,0,0);
    // Gather all completed topic dates
    let allDates = [];
    userPlans.forEach(plan => {
      plan.topicsProgress.forEach(topic => {
        if (topic.completedAt) {
          totalCompleted++;
          allDates.push(new Date(topic.completedAt));
          const topicDay = new Date(topic.completedAt);
          topicDay.setHours(0,0,0,0);
          if (topicDay.getTime() === today.getTime()) completedToday++;
        }
      });
    });
    // Calculate streak (consecutive days with at least one completion)
    if (allDates.length > 0) {
      allDates = allDates.map(d => {
        d.setHours(0,0,0,0); return d;
      });
      allDates = Array.from(new Set(allDates.map(d => d.getTime()))).sort((a,b) => b-a);
      let current = today.getTime();
      for (let i = 0; i < allDates.length; i++) {
        if (allDates[i] === current) {
          streak++;
          current -= 24*60*60*1000;
        } else {
          break;
        }
      }
    }
    res.json({ totalCompleted, completedToday, streak });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// Create a custom user study plan
exports.createCustomPlan = async (req, res) => {
  try {
    const { title, description, topics } = req.body;
    const userPlan = new UserStudyPlan({
      userId: req.user.id,
      isCustom: true,
      custom: { title, description, topics },
      topicsProgress: topics.map((t, i) => ({ topicId: i, status: 'not-started' }))
    });
    await userPlan.save();
    res.status(201).json(userPlan);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create custom plan' });
  }
};

// Update a custom user study plan
exports.updateCustomPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { title, description, topics } = req.body;
    const userPlan = await UserStudyPlan.findOne({ _id: planId, userId: req.user.id, isCustom: true });
    if (!userPlan) return res.status(404).json({ message: 'Custom plan not found' });
    userPlan.custom.title = title;
    userPlan.custom.description = description;
    userPlan.custom.topics = topics;
    userPlan.topicsProgress = topics.map((t, i) => ({ topicId: i, status: 'not-started' }));
    await userPlan.save();
    res.json(userPlan);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update custom plan' });
  }
};

// Delete a custom user study plan
exports.deleteCustomPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const result = await UserStudyPlan.deleteOne({ _id: planId, userId: req.user.id, isCustom: true });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Custom plan not found' });
    res.json({ message: 'Custom plan deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete custom plan' });
  }
};

// Share a plan with another user
exports.sharePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { userId } = req.body;
    const userPlan = await UserStudyPlan.findOne({ _id: planId, userId: req.user.id });
    if (!userPlan) return res.status(404).json({ message: 'Plan not found' });
    if (!userPlan.sharedWith.includes(userId)) userPlan.sharedWith.push(userId);
    await userPlan.save();
    res.json({ message: 'Plan shared' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to share plan' });
  }
};

// Join a group plan
exports.joinGroupPlan = async (req, res) => {
  try {
    const { groupId, planId } = req.body;
    let group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.members.includes(req.user.id)) group.members.push(req.user.id);
    await group.save();
    // Add groupId to user study plan
    let userPlan = await UserStudyPlan.findOne({ userId: req.user.id, studyPlanId: planId });
    if (!userPlan) {
      // Create a new user plan for this group
      userPlan = new UserStudyPlan({ userId: req.user.id, studyPlanId: planId, groupId });
    } else {
      userPlan.groupId = groupId;
    }
    await userPlan.save();
    res.json({ message: 'Joined group plan' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to join group plan' });
  }
}; 