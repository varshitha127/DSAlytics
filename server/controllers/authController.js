const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// Register User
exports.register = async (req, res) => {
  // Always succeed, ignore input
  return res.status(201).json({
    message: 'User registered successfully',
    token: 'fake-jwt-token',
    user: {
      id: 'fake-user-id',
      name: req.body.name || 'Any User',
      email: req.body.email || 'any@email.com',
      role: 'user',
      stats: {}
    }
  });
};

// Login User
exports.login = async (req, res) => {
  // Always succeed, ignore input
  return res.json({
    message: 'Login successful',
    token: 'fake-jwt-token',
    user: {
      id: 'fake-user-id',
      name: 'Any User',
      email: req.body.email || 'any@email.com',
      role: 'user',
      stats: {}
    }
  });
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  // Return the same fake user as in login/register
  return res.json({
    id: 'fake-user-id',
    name: 'Any User',
    email: 'any@email.com',
    role: 'user',
    stats: {}
  });
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, location, website } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (bio !== undefined) user.profile.bio = bio;
    if (location !== undefined) user.profile.location = location;
    if (website !== undefined) user.profile.website = website;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        stats: user.stats
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error while updating profile' 
    });
  }
}; 