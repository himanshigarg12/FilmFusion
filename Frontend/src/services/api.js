// api.js - All API calls to backend in one place
// Think of this as a "phone book" for your backend
// Instead of writing full URL every time — just call the function!

import axios from 'axios'

// Base URL of your Node backend
const NODE_API = 'http://localhost:5000/api'

// Base URL of your Flask ML backend
const FLASK_API = 'http://localhost:8000/api'

// ==========================================
// AUTH APIs - connects to Node backend
// ==========================================

// Signup API call
export const signupAPI = async (name, email, password) => {
  const response = await axios.post(`${NODE_API}/auth/signup`, {
    name,
    email,
    password
  })
  return response.data
}

// Login API call
export const loginAPI = async (email, password) => {
  const response = await axios.post(`${NODE_API}/auth/login`, {
    email,
    password
  })
  return response.data
}

// Get user profile
export const getProfileAPI = async (token) => {
  const response = await axios.get(`${NODE_API}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

// ==========================================
// MOVIE APIs - connects to Flask ML backend
// ==========================================

// Get movie recommendations by mood
export const getRecommendationsAPI = async (mood) => {
  const response = await axios.post(`${FLASK_API}/recommend`, { mood })
  return response.data
}

// Analyse sentiment of a review
export const analyseSentimentAPI = async (review) => {
  const response = await axios.post(`${FLASK_API}/sentiment`, { review })
  return response.data
}

// Predict hit or flop
export const predictHitFlopAPI = async (movieData) => {
  const response = await axios.post(`${FLASK_API}/predict`, movieData)
  return response.data
}