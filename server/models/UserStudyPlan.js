const mongoose = require('mongoose');

const topicProgressSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['not-started', 'in-progress', 'completed', 'locked'], default: 'not-started' },
  completedAt: Date
});

const userStudyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studyPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyPlan', required: true },
  status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
  progress: { type: Number, default: 0 },
  topicsProgress: [topicProgressSchema],
  startedAt: Date,
  completedAt: Date,
  lastActivityAt: Date,
  isCustom: { type: Boolean, default: false },
  custom: {
    title: String,
    description: String,
    topics: [{ title: String, duration: String }]
  },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('UserStudyPlan', userStudyPlanSchema); 