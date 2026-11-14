// api.js - All API calls to backend in one place

import axios from 'axios'

// Base URLs
const NODE_API = 'http://localhost:5000/api'
const FLASK_API = 'http://localhost:8000/api'

// ==========================================
// AUTH APIs - Node backend
// ==========================================

export const signupAPI = async (name, email, password) => {
  const response = await axios.post(`${NODE_API}/auth/signup`, {
    name, email, password
  })
  return response.data
}

export const loginAPI = async (email, password) => {
  const response = await axios.post(`${NODE_API}/auth/login`, {
    email, password
  })
  return response.data
}

export const getProfileAPI = async (token) => {
  const response = await axios.get(`${NODE_API}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

// ==========================================
// MOVIE APIs - Flask backend
// ==========================================

// Get trending movies from TMDB
export const getTrendingMoviesAPI = async () => {
  const response = await axios.get(`${FLASK_API}/movies/trending`)
  return response.data
}

// Search movies
export const searchMoviesAPI = async (query) => {
  const response = await axios.get(`${FLASK_API}/movies/search`, {
    params: { query }
  })
  return response.data
}

// Get Bollywood movies
export const getBollywoodMoviesAPI = async () => {
  const response = await axios.get(`${FLASK_API}/movies/bollywood`)
  return response.data
}

// Get mood based recommendations
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

// ==========================================
// NEWS APIs - Flask backend
// ==========================================

// Get entertainment news
export const getNewsAPI = async () => {
  const response = await axios.get(`${FLASK_API}/news`)
  return response.data
}

// Get Bollywood news
export const getBollywoodNewsAPI = async () => {
  const response = await axios.get(`${FLASK_API}/news/bollywood`)
  return response.data
}


// Get real celebrities from TMDB
export const getCelebritiesAPI = async () => {
  const response = await axios.get(`${FLASK_API}/celebrities`)
  return response.data
}

// Get celebrity upcoming movies
export const getCelebrityMoviesAPI = async (personId) => {
  const response = await axios.get(`${FLASK_API}/celebrities/${personId}/movies`)
  return response.data
}