require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const connectDB = require('../config/db');
const Question = require('../models/Question');

const importQuestions = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    const questions = [];
    const csvPath = path.join(__dirname, '../../data/leetcode_questions.csv');

    // Read and process CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          questions.push({
            id: `pr_${String(data.id).padStart(4, '0')}`,
            type: 'practical',
            questionType: 'code-explanation',
            title: data.title,
            question: data.description || data.title,
            description: data.description || data.title,
            difficulty: data.difficulty.toLowerCase(),
            subject: 'DSA',
            category: data.pattern?.[0] || 'General',
            tags: data.pattern || [],
            companyTags: data.companies?.map(c => c.name) || [],
            expectedTime: '30 minutes',
            source: 'LeetCode',
            isPremium: data.premium || false,
            acceptanceRate: data.acceptance_rate,
            likes: data.likes || 0,
            dislikes: data.dislikes || 0,
            constraints: data.constraints || [],
            testCases: data.test_cases || [],
            sampleSolution: {
              language: 'Python',
              code: data.solution || ''
            }
          });
        })
        .on('end', async () => {
          try {
            await Question.insertMany(questions);
            console.log(`Successfully imported ${questions.length} questions`);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error importing questions:', error);
    process.exit(1);
  }
};

// Run the import
importQuestions(); 