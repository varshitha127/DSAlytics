const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: String,
  status: { type: String, enum: ['not-started', 'in-progress', 'completed', 'locked'], default: 'not-started' },
  duration: String
}, { _id: true });

const studyPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  duration: String,
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
  topics: [topicSchema],
  youtubeUrl: String
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', studyPlanSchema); 