// auth.controller.js - Handles login and signup logic
// Think of this as the "brain" that processes user requests

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// SIGNUP CONTROLLER
// When user fills signup form and clicks submit
// ==========================================
const signup = async (req, res) => {
  try {
    // Get data sent from React signup form
    const { name, email, password } = req.body;

    // Check if all fields are filled
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please fill all fields' 
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already registered! Please login.' 
      });
    }

    // Encrypt the password before saving
    // bcrypt turns "mypassword123" into "$2a$10$xyz..." 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in database
    const newUser = new User({
      name,
      email,
      password: hashedPassword  // save encrypted password
    });

    // Save user to MongoDB
    await newUser.save();

    // Create JWT token for this user
    // Token is like a "pass" that keeps user logged in
    const token = jwt.sign(
      { userId: newUser._id },          // what to store in token
      process.env.JWT_SECRET,            // secret key from .env
      { expiresIn: '7d' }               // token valid for 7 days
    );

    // Send success response back to React
    res.status(201).json({
      message: 'Account created successfully! 🎉',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        followedActors: newUser.followedActors,
        watchlist: newUser.watchlist
      }
    });

  } catch (error) {
    console.log('Signup error:', error.message);
    res.status(500).json({ 
      message: 'Something went wrong. Please try again.' 
    });
  }
};

// ==========================================
// LOGIN CONTROLLER
// When user fills login form and clicks submit
// ==========================================
const login = async (req, res) => {
  try {
    // Get data sent from React login form
    const { email, password } = req.body;

    // Check if both fields are filled
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please enter email and password' 
      });
    }

    // Find user with this email in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'No account found with this email!' 
      });
    }

    // Check if password is correct
    // bcrypt compares entered password with encrypted one
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ 
        message: 'Wrong password! Please try again.' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send success response back to React
    res.status(200).json({
      message: 'Login successful! Welcome back 🎬',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        followedActors: user.followedActors,
        watchlist: user.watchlist
      }
    });

  } catch (error) {
    console.log('Login error:', error.message);
    res.status(500).json({ 
      message: 'Something went wrong. Please try again.' 
    });
  }
};

// ==========================================
// GET PROFILE CONTROLLER
// Get logged in user's data
// ==========================================
const getProfile = async (req, res) => {
  try {
    // req.userId comes from authMiddleware
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.log('Get profile error:', error.message);
    res.status(500).json({ 
      message: 'Something went wrong.' 
    });
  }
};

// Export all controllers
module.exports = { signup, login, getProfile };