// User.js - This defines what a user looks like in our database
// Think of this as a template/form for every user that registers

const mongoose = require('mongoose');

// USER SCHEMA - structure of user data in MongoDB
const userSchema = new mongoose.Schema({
  
  // Full name of user
  name: {
    type: String,
    required: true,    // must be provided
    trim: true         // removes extra spaces
  },

  // Email address - must be unique (no two users with same email)
  email: {
    type: String,
    required: true,
    unique: true,      // no duplicate emails
    lowercase: true,   // saves as lowercase always
    trim: true
  },

  // Password - will be encrypted before saving
  password: {
    type: String,
    required: true,
    minlength: 6       // minimum 6 characters
  },

  // List of actors user follows
  // Example: ['Shah Rukh Khan', 'Deepika Padukone']
  followedActors: {
    type: [String],
    default: []        // empty list by default
  },

  // User's saved watchlist of movies
  watchlist: {
    type: [String],
    default: []        // empty list by default
  },

  // Profile picture URL (optional)
  avatar: {
    type: String,
    default: ''
  },

  // When was account created
  createdAt: {
    type: Date,
    default: Date.now  // automatically saves current time
  }

});

// Export the model so other files can use it
const User = mongoose.model('User', userSchema);
module.exports = User;