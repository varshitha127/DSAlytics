const mongoose = require('mongoose');

const userProblemStatusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: String, required: true }, // Use string to match problem id in JSON/CSV
  status: {
    type: String,
    enum: ['unsolved', 'attempted', 'solved'],
    default: 'unsolved'
  },
  favorite: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

userProblemStatusSchema.index({ userId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('UserProblemStatus', userProblemStatusSchema); 