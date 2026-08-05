// auth.js - Routes file
// Think of routes as "addresses" for your API
// Like: /api/auth/signup, /api/auth/login

const express = require('express');
const router = express.Router();

// Import controllers we just wrote
const { signup, login, getProfile } = require('../controllers/auth.controller');

// Import middleware to protect routes
const authMiddleware = require('../middleware/authMiddleware');

// ==========================================
// PUBLIC ROUTES - anyone can access these
// ==========================================

// POST /api/auth/signup
// When React sends signup form data here
router.post('/signup', signup);

// POST /api/auth/login
// When React sends login form data here
router.post('/login', login);

// ==========================================
// PROTECTED ROUTES - only logged in users
// ==========================================

// GET /api/auth/profile
// Only works if user is logged in (has valid token)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;