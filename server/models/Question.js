const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['theoretical', 'practical'],
    required: true
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'direct-answer', 'true-false', 'code-explanation'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  question: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    default: null
  },
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  keyPoints: {
    type: [String],
    default: []
  },
  relatedConcepts: {
    type: [String],
    default: []
  },
  complexity: {
    time: String,
    space: String
  },
  tags: {
    type: [String],
    default: []
  },
  expectedTime: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  testCases: [{
    input: String,
    output: String
  }],
  sampleSolution: {
    language: {
      type: String,
      enum: ['Python', 'Java', 'C++', 'JavaScript'],
      default: 'Python'
    },
    code: String
  },
  acceptanceRate: Number,
  likes: Number,
  dislikes: Number,
  isPremium: {
    type: Boolean,
    default: false
  },
  companyTags: [String],
  similarQuestions: [String],
  hints: [String],
  constraints: [String]
}, {
  timestamps: true
});

// Indexes for better query performance
questionSchema.index({ title: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ companyTags: 1 });
questionSchema.index({ subject: 1 });
questionSchema.index({ category: 1 });

// Update the updatedAt timestamp before saving
questionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Question', questionSchema); 