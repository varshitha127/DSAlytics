const { OpenAI } = require('openai');
const Question = require('../models/Question');

class AiInterviewService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateQuestions(category, difficulty, count = 5) {
    try {
      // Get questions from database
      const questions = await Question.find({
        category,
        difficulty,
        type: { $in: ['theoretical', 'practical'] }
      }).limit(count);

      return questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  }

  async analyzeAnswer(question, answer) {
    try {
      const prompt = `
        Question: ${question.text}
        Answer: ${answer}
        
        Please analyze this answer and provide:
        1. Accuracy score (0-100)
        2. Key points covered
        3. Areas for improvement
        4. Brief feedback
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });

      return this.parseAnalysis(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing answer:', error);
      throw error;
    }
  }

  async generateFeedback(sessionData) {
    try {
      const prompt = `
        Based on the following interview session data, provide comprehensive feedback:
        ${JSON.stringify(sessionData, null, 2)}
        
        Include:
        1. Overall performance score
        2. Key strengths
        3. Areas for improvement
        4. Detailed feedback for each category
        5. Recommended next steps
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      return this.parseFeedback(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating feedback:', error);
      throw error;
    }
  }

  parseAnalysis(analysis) {
    // TODO: Implement parsing logic for AI response
    return {
      score: 85,
      keyPoints: ['Point 1', 'Point 2'],
      improvements: ['Improvement 1'],
      feedback: 'Sample feedback'
    };
  }

  parseFeedback(feedback) {
    // TODO: Implement parsing logic for AI feedback
    return {
      overallScore: 85,
      strengths: ['Strength 1', 'Strength 2'],
      areasForImprovement: ['Area 1'],
      detailedFeedback: 'Sample detailed feedback',
      nextSteps: ['Step 1', 'Step 2']
    };
  }
}

module.exports = new AiInterviewService(); 