// Test script to verify API calls from frontend
import axios from 'axios';

// Set base URL
axios.defaults.baseURL = 'http://localhost:5000';

// Test registration
async function testRegistration() {
  try {
    console.log('Testing registration...');
    const response = await axios.post('/api/auth/register', {
      name: 'Frontend Test User',
      email: 'frontend@test.com',
      password: 'password123'
    });
    console.log('Registration successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    return null;
  }
}

// Test login
async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post('/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return null;
  }
}

// Run tests
async function runTests() {
  console.log('Starting API tests...');
  
  // Test login with existing user
  const loginToken = await testLogin();
  
  if (loginToken) {
    console.log('✅ Login test passed');
  } else {
    console.log('❌ Login test failed');
  }
  
  // Test registration with new user
  const registerToken = await testRegistration();
  
  if (registerToken) {
    console.log('✅ Registration test passed');
  } else {
    console.log('❌ Registration test failed');
  }
}

// Export for use in browser console
window.testAPI = runTests; 