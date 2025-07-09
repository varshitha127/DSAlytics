const mongoose = require('mongoose');
const StudyPlan = require('../models/StudyPlan');

dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-tracker';

const studyPlans = [
  {
    title: 'DSA with Java',
    description: 'Master Data Structures and Algorithms using Java',
    category: 'dsa',
    difficulty: 'beginner',
    duration: '8 weeks',
    progress: 0,
    status: 'not-started',
    youtubeUrl: 'https://www.youtube.com/watch?v=rZ41y93P2Qo&list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ',
    topics: [
      { title: 'Arrays and Strings', status: 'not-started', duration: '1 week' },
      { title: 'Linked Lists', status: 'not-started', duration: '1 week' },
      { title: 'Stacks and Queues', status: 'not-started', duration: '1 week' },
      { title: 'Trees and Graphs', status: 'not-started', duration: '2 weeks' },
      { title: 'Sorting Algorithms', status: 'not-started', duration: '1 week' },
      { title: 'Searching Algorithms', status: 'not-started', duration: '1 week' },
      { title: 'Dynamic Programming', status: 'not-started', duration: '1 week' }
    ]
  },
  {
    title: 'OOPs with Java',
    description: 'Object Oriented Programming Concepts in Java',
    category: 'oops',
    difficulty: 'beginner',
    duration: '4 weeks',
    progress: 0,
    status: 'not-started',
    youtubeUrl: 'https://www.youtube.com/watch?v=BSVKUk58K6U&list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk',
    topics: [
      { title: 'Classes and Objects', status: 'not-started', duration: '1 week' },
      { title: 'Inheritance', status: 'not-started', duration: '1 week' },
      { title: 'Polymorphism', status: 'not-started', duration: '1 week' },
      { title: 'Encapsulation & Abstraction', status: 'not-started', duration: '1 week' }
    ]
  },
  {
    title: 'DBMS',
    description: 'Database Management Systems - Concepts and SQL',
    category: 'dbms',
    difficulty: 'intermediate',
    duration: '6 weeks',
    progress: 0,
    status: 'not-started',
    youtubeUrl: 'https://www.youtube.com/watch?v=6Iu45VZGQDk&list=PLBlnK6fEyqRi_CUQ-FXxgzKQ1dwr_ZJWZ&pp=0gcJCV8EOCosWNin',
    topics: [
      { title: 'Database Design', status: 'not-started', duration: '1 week' },
      { title: 'SQL Fundamentals', status: 'not-started', duration: '2 weeks' },
      { title: 'Advanced SQL', status: 'not-started', duration: '1 week' },
      { title: 'Indexing and Optimization', status: 'not-started', duration: '1 week' },
      { title: 'Transactions and ACID', status: 'not-started', duration: '1 week' }
    ]
  },
  {
    title: 'Operating Systems',
    description: 'Learn OS concepts, processes, and memory management',
    category: 'os',
    difficulty: 'advanced',
    duration: '6 weeks',
    progress: 0,
    status: 'not-started',
    youtubeUrl: 'https://www.youtube.com/watch?v=RozoeWzT7IM&list=PLdo5W4Nhv31a5ucW_S1K3-x6ztBRD-PNa',
    topics: [
      { title: 'Process Management', status: 'not-started', duration: '1 week' },
      { title: 'Memory Management', status: 'not-started', duration: '1 week' },
      { title: 'File Systems', status: 'not-started', duration: '1 week' },
      { title: 'Synchronization', status: 'not-started', duration: '1 week' },
      { title: 'Virtual Memory', status: 'not-started', duration: '1 week' },
      { title: 'I/O Systems', status: 'not-started', duration: '1 week' }
    ]
  },
  {
    title: 'Computer Networks',
    description: 'Understand networking protocols and architecture',
    category: 'cn',
    difficulty: 'intermediate',
    duration: '4 weeks',
    progress: 0,
    status: 'not-started',
    youtubeUrl: 'https://www.youtube.com/watch?v=JFF2vJaN0Cw&list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_',
    topics: [
      { title: 'Network Fundamentals', status: 'not-started', duration: '1 week' },
      { title: 'TCP/IP Protocol', status: 'not-started', duration: '1 week' },
      { title: 'Routing and Switching', status: 'not-started', duration: '1 week' },
      { title: 'Network Security', status: 'not-started', duration: '1 week' }
    ]
  },
  {
    title: 'Interview Preparation',
    description: 'Crack your next interview with these handpicked resources',
    category: 'interview',
    difficulty: 'beginner',
    duration: '4 weeks',
    progress: 0,
    status: 'not-started',
    youtubeUrl: 'https://www.youtube.com/watch?v=Y95eI-ek_E8&list=PLhrBmkjLNq1U9D_PVJpUNzh9qFxsNmEwo',
    topics: [
      { title: 'Aptitude', status: 'not-started', duration: '1 week' },
      { title: 'Coding Rounds', status: 'not-started', duration: '1 week' },
      { title: 'System Design', status: 'not-started', duration: '1 week' },
      { title: 'HR Interview', status: 'not-started', duration: '1 week' }
    ]
  },
  {
    title: 'Web Development',
    description: 'Master modern web development technologies',
    category: 'web',
    difficulty: 'intermediate',
    duration: '10 weeks',
    progress: 0,
    status: 'not-started',
    youtubeUrl: 'https://www.youtube.com/watch?v=tVzUXW6siu0&list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w&pp=0gcJCV8EOCosWNin',
    topics: [
      { title: 'HTML', status: 'not-started', duration: '1 week' },
      { title: 'CSS', status: 'not-started', duration: '1 week' },
      { title: 'JavaScript', status: 'not-started', duration: '2 weeks' },
      { title: 'React.js', status: 'not-started', duration: '2 weeks' },
      { title: 'Node.js Backend', status: 'not-started', duration: '2 weeks' },
      { title: 'Database Integration', status: 'not-started', duration: '1 week' },
      { title: 'Deployment', status: 'not-started', duration: '1 week' },
      { title: 'Advanced Concepts', status: 'not-started', duration: '1 week' }
    ]
  }
];

async function seed() {
  await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  await StudyPlan.deleteMany({});
  await StudyPlan.insertMany(studyPlans);
  console.log('Study plans seeded!');
  await mongoose.disconnect();
}

seed(); 