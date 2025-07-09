const fs = require('fs');
const path = require('path');

exports.getProblems = (req, res) => {
  const filePath = path.join(__dirname, '../data/questions.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load problems.' });
    try {
      const parsed = JSON.parse(data);
      res.json({ problems: parsed.data });
    } catch (parseErr) {
      res.status(500).json({ error: 'Invalid problems data.' });
    }
  });
}; 