// Recommend.jsx - AI mood based recommendations
import { useState } from 'react'
import Navbar from '../components/Navbar'
import MovieCard from '../components/MovieCard'
import './Recommend.css'

const Recommend = () => {
  const [theme, setTheme] = useState('dark')
  const [selectedMood, setSelectedMood] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const moods = [
    { emoji: '😂', label: 'Funny', color: '#fef3c7' },
    { emoji: '😢', label: 'Emotional', color: '#dbeafe' },
    { emoji: '😱', label: 'Thriller', color: '#fee2e2' },
    { emoji: '💕', label: 'Romance', color: '#fce7f3' },
    { emoji: '⚡', label: 'Action', color: '#d1fae5' },
    { emoji: '👻', label: 'Horror', color: '#ede9fe' },
    { emoji: '🤣', label: 'Comedy', color: '#fef3c7' },
    { emoji: '🎭', label: 'Drama', color: '#e0f2fe' },
  ]

  // Static recommendations — will connect to Flask ML later
  const moodMovies = {
    Funny: [
      { id: 1, title: 'Stree 3', genre: 'Horror Comedy', rating: '8.2', emoji: '👻', badge: 'Hit' },
      { id: 2, title: 'Fukrey 4', genre: 'Comedy', rating: '7.8', emoji: '😂', badge: 'Hit' },
      { id: 3, title: 'Golmaal 6', genre: 'Comedy', rating: '7.5', emoji: '🤣', badge: 'Upcoming' },
    ],
    Action: [
      { id: 1, title: 'Pushpa 3', genre: 'Action', rating: '8.9', emoji: '🔥', badge: 'Hit' },
      { id: 2, title: 'King', genre: 'Action', rating: '9.1', emoji: '👑', badge: 'Upcoming' },
      { id: 3, title: 'War 3', genre: 'Action', rating: '8.0', emoji: '💥', badge: 'Upcoming' },
    ],
    Romance: [
      { id: 1, title: 'Ae Dil Hai Mushkil 2', genre: 'Romance', rating: '7.9', emoji: '💕', badge: 'Upcoming' },
      { id: 2, title: 'Yeh Jawaani 3', genre: 'Romance', rating: '7.5', emoji: '❤️', badge: 'Hit' },
    ],
    Thriller: [
      { id: 1, title: 'Mirzapur 4', genre: 'Crime Thriller', rating: '8.8', emoji: '🔫', badge: 'OTT' },
      { id: 2, title: 'Sacred Games 3', genre: 'Thriller', rating: '8.5', emoji: '🕵️', badge: 'OTT' },
    ],
    Horror: [
      { id: 1, title: 'Bhool Bhulaiyaa 4', genre: 'Horror', rating: '7.8', emoji: '👁️', badge: 'Upcoming' },
      { id: 2, title: 'Stree 3', genre: 'Horror Comedy', rating: '8.2', emoji: '👻', badge: 'Hit' },
    ],
    Emotional: [
      { id: 1, title: 'Ae Watan Mere Watan 2', genre: 'Drama', rating: '8.1', emoji: '🇮🇳', badge: 'OTT' },
      { id: 2, title: 'Panchayat 4', genre: 'Drama', rating: '9.0', emoji: '🏘️', badge: 'OTT' },
    ],
    Comedy: [
      { id: 1, title: 'Fukrey 4', genre: 'Comedy', rating: '7.8', emoji: '😂', badge: 'Hit' },
      { id: 2, title: 'Golmaal 6', genre: 'Comedy', rating: '7.5', emoji: '🤣', badge: 'Upcoming' },
    ],
    Drama: [
      { id: 1, title: 'Panchayat 4', genre: 'Drama', rating: '9.0', emoji: '🏘️', badge: 'OTT' },
      { id: 2, title: 'Scam 3', genre: 'Drama', rating: '8.7', emoji: '📊', badge: 'OTT' },
    ],
  }

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    setLoading(true)

    // Simulate API call — later this calls Flask ML backend
    setTimeout(() => {
      setRecommendations(moodMovies[mood] || [])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className={`recommend-container ${theme}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="recommend-body">
        <h2 className="page-title">🎯 AI Movie Recommender</h2>
        <p className="page-subtitle">Tell us your mood — our AI picks the perfect movie for you!</p>

        {/* Mood selection */}
        <div className="mood-section">
          <h3>How are you feeling today?</h3>
          <div className="mood-grid">
            {moods.map(mood => (
              <button
                key={mood.label}
                className={`mood-card ${selectedMood === mood.label ? 'active' : ''}`}
                onClick={() => handleMoodSelect(mood.label)}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="loading-box">
            🤖 AI is finding perfect movies for you...
          </div>
        )}

        {!loading && recommendations.length > 0 && (
          <div className="results-section">
            <h3>Perfect picks for your {selectedMood} mood 🎬</h3>
            <div className="recommend-grid">
              {recommendations.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Recommend