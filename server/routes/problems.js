const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const UserProblemStatus = require('../models/UserProblemStatus');

// GET /api/problems/status/all - get all statuses for logged-in user
router.get('/status/all', authenticateToken, async (req, res) => {
  try {
    const statuses = await UserProblemStatus.find({ userId: req.user._id });
    res.json({ statuses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch statuses.' });
  }
});

// POST /api/problems/status - update a problem's status for the user
router.post('/status', authenticateToken, async (req, res) => {
  const { problemId, status, favorite } = req.body;
  if (!problemId) return res.status(400).json({ error: 'problemId is required.' });
  try {
    const update = {};
    if (status) update.status = status;
    if (typeof favorite === 'boolean') update.favorite = favorite;
    update.updatedAt = Date.now();
    const result = await UserProblemStatus.findOneAndUpdate(
      { userId: req.user._id, problemId },
      { $set: update },
      { upsert: true, new: true }
    );
    res.json({ status: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// GET /api/problems/:category
router.get('/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  const filePath = path.join(__dirname, `../data/${category}.json`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'Category not found.' });
    try {
      const problems = JSON.parse(data);
      res.json({ problems });
    } catch (parseErr) {
      res.status(500).json({ error: 'Invalid problems data.' });
    }
  });
});

module.exports = router; 