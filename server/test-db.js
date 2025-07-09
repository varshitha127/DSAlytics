const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dsa-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Find all users
    const users = await User.find({}).select('-password');
    console.log('All users in database:', users);
    
    // Find specific user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (testUser) {
      console.log('Test user found:', {
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        isActive: testUser.isActive,
        createdAt: testUser.createdAt
      });
      
      // Test password comparison
      const isPasswordValid = await testUser.comparePassword('password123');
      console.log('Password comparison result:', isPasswordValid);
    } else {
      console.log('Test user not found');
    }
    
  } catch (error) {
    console.error('Database query error:', error);
  }
  
  mongoose.connection.close();
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
}); 