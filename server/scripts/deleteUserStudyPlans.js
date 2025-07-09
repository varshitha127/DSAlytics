const mongoose = require('mongoose');
const UserStudyPlan = require('../models/UserStudyPlan');

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-tracker';

async function deleteAll() {
  await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await UserStudyPlan.deleteMany({});
  console.log(`Deleted ${result.deletedCount} UserStudyPlan documents.`);
  await mongoose.disconnect();
}

deleteAll(); 