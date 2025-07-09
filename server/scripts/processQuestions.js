const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
const Question = require('../models/Question');

// Load question schema
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/questionSchema.json'), 'utf8'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dsa-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SUBJECTS = {
  'CN_R.pdf': 'Computer Networks',
  'DBMS_R.pdf': 'Database Management',
  'sql_R.pdf': 'SQL',
  'Interview_R.pdf': 'General Interview',
  'SystemDesign_R.pdf': 'System Design',
  'os_R.pdf': 'Operating Systems',
  'OOps_R.pdf': 'Object Oriented Programming',
  'DSA_R.pdf': 'DSA',
  'Java_R.pdf': 'Java',
  'Python_R.pdf': 'Python',
  'WebDev_R.pdf': 'Web Development'
};

const QUESTION_TYPES = ['multiple-choice', 'direct-answer', 'true-false', 'code-explanation'];

async function extractQuestionsFromPDF(pdfPath, subject) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    // Split text into potential questions
    const text = data.text;
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    
    const questions = [];
    let currentQuestion = null;
    let currentType = null;
    
    for (const paragraph of paragraphs) {
      const trimmedParagraph = paragraph.trim();
      
      // Check for question markers
      if (/^\d+\.|^Q\d+\.|^Question\s*\d+:|^[A-Z][^a-z]+\s*\d+:/i.test(trimmedParagraph)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        
        // Determine question type
        currentType = determineQuestionType(trimmedParagraph);
        
        // Extract question text and potential options
        const lines = trimmedParagraph.split('\n');
        const questionText = lines[0].replace(/^\d+\.|^Q\d+\.|^Question\s*\d+:|^[A-Z][^a-z]+\s*\d+:/i, '').trim();
        
        // Look for options (usually marked with a), b), c), d) or 1), 2), 3), 4))
        const options = lines
          .slice(1)
          .filter(line => /^[a-d]\)|^[1-4]\)/i.test(line.trim()))
          .map(line => line.replace(/^[a-d]\)|^[1-4]\)/i, '').trim());
        
        currentQuestion = {
          questionType: currentType,
          question: questionText,
          options: options.length > 0 ? options : null,
          subject,
          category: getRandomCategory(subject),
          difficulty: getRandomDifficulty(subject)
        };
      } else if (currentQuestion) {
        // This might be an explanation, answer, or additional context
        if (!currentQuestion.explanation) {
          currentQuestion.explanation = trimmedParagraph;
        } else if (!currentQuestion.correctAnswer && /^Answer:|^Solution:/i.test(trimmedParagraph)) {
          currentQuestion.correctAnswer = trimmedParagraph.replace(/^Answer:|^Solution:/i, '').trim();
        }
      }
    }
    
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    
    return questions;
  } catch (error) {
    console.error(`Error processing ${pdfPath}:`, error);
    return [];
  }
}

function determineQuestionType(paragraph) {
  const text = paragraph.toLowerCase();
  
  if (/explain|describe|what is|define|how does/i.test(text)) {
    return 'direct-answer';
  } else if (/true|false|t\/f/i.test(text)) {
    return 'true-false';
  } else if (/implement|write|code|program/i.test(text)) {
    return 'code-explanation';
  } else if (/[a-d]\)|^[1-4]\)/i.test(text)) {
    return 'multiple-choice';
  }
  
  // Default to direct-answer if type can't be determined
  return 'direct-answer';
}

function getRandomCategory(subject) {
  const subjectData = schema.theoretical.subjects[subject];
  const categories = subjectData && subjectData.categories ? subjectData.categories : ['General'];
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomDifficulty(subject) {
  const subjectData = schema.theoretical.subjects[subject];
  const difficulties = subjectData && subjectData.difficulty ? subjectData.difficulty : ['easy', 'medium', 'hard'];
  return difficulties[Math.floor(Math.random() * difficulties.length)];
}

async function generateAnswerWithAI(question) {
  try {
    let prompt = '';
    
    switch (question.questionType) {
      case 'multiple-choice':
        prompt = `
          Question: ${question.question}
          Options: ${question.options.join(', ')}
          
          Please provide:
          1. The correct answer (just the option letter/number)
          2. A detailed explanation
          3. Key points to remember
          
          Format the response as JSON with keys: correctAnswer, explanation, keyPoints
        `;
        break;
        
      case 'direct-answer':
        prompt = `
          Question: ${question.question}
          
          Please provide:
          1. A comprehensive answer
          2. A detailed explanation
          3. Key points to remember
          4. Related concepts
          
          Format the response as JSON with keys: correctAnswer, explanation, keyPoints, relatedConcepts
        `;
        break;
        
      case 'true-false':
        prompt = `
          Question: ${question.question}
          
          Please provide:
          1. The correct answer (true/false)
          2. A detailed explanation
          3. Key points to remember
          
          Format the response as JSON with keys: correctAnswer, explanation, keyPoints
        `;
        break;
        
      case 'code-explanation':
        prompt = `
          Question: ${question.question}
          
          Please provide:
          1. A code solution
          2. A detailed explanation of the approach
          3. Time and space complexity
          4. Key points to remember
          
          Format the response as JSON with keys: correctAnswer, explanation, keyPoints, complexity
        `;
        break;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return {
      ...question,
      correctAnswer: response.correctAnswer,
      explanation: response.explanation,
      keyPoints: response.keyPoints,
      relatedConcepts: response.relatedConcepts,
      complexity: response.complexity
    };
  } catch (error) {
    console.error('Error generating answer:', error);
    return question;
  }
}

async function saveQuestionToDB(question) {
  try {
    // Check if question with same ID already exists
    const existingQuestion = await Question.findOne({ id: question.id });
    if (existingQuestion) {
      console.log(`Question ${question.id} already exists, updating...`);
      await Question.findOneAndUpdate({ id: question.id }, question, { new: true });
    } else {
      await Question.create(question);
    }
  } catch (error) {
    console.error('Error saving question to database:', error);
    throw error;
  }
}

async function processAllPDFs() {
  const dataDir = path.join(__dirname, '../../data');
  let questionCount = 0;
  
  try {
    // Clear existing questions if needed
    // await Question.deleteMany({ type: 'theoretical' });
    
    for (const [pdfFile, subject] of Object.entries(SUBJECTS)) {
      console.log(`Processing ${pdfFile}...`);
      const pdfPath = path.join(dataDir, pdfFile);
      
      if (fs.existsSync(pdfPath)) {
        const extractedQuestions = await extractQuestionsFromPDF(pdfPath, subject);
        
        // Generate answers for each question using AI
        for (const question of extractedQuestions) {
          const questionWithAnswer = await generateAnswerWithAI(question);
          const questionToSave = {
            id: `th_${String(questionCount + 1).padStart(4, '0')}`,
            type: 'theoretical',
            ...questionWithAnswer,
            tags: questionWithAnswer.keyPoints || []
          };
          
          await saveQuestionToDB(questionToSave);
          questionCount++;
          
          // Log progress every 10 questions
          if (questionCount % 10 === 0) {
            console.log(`Processed ${questionCount} questions so far...`);
          }
        }
      } else {
        console.warn(`PDF file not found: ${pdfPath}`);
      }
    }
    
    console.log(`Successfully processed ${questionCount} questions`);
    
    // Also save to JSON file as backup
    const questions = await Question.find({ type: 'theoretical' });
    const outputPath = path.join(dataDir, 'questionBank.json');
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    console.log(`Backup saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error processing questions:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
processAllPDFs().catch(console.error); 