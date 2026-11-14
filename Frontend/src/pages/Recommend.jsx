import { useState } from 'react'
import Navbar from '../components/Navbar'
import MovieCard from '../components/MovieCard'
import { getRecommendationsAPI } from '../services/api'
import './Recommend.css'

const Recommend = () => {
  const [selectedMood, setSelectedMood] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const moods = [
    { emoji: '😂', label: 'Funny' },
    { emoji: '😢', label: 'Emotional' },
    { emoji: '😱', label: 'Thriller' },
    { emoji: '💕', label: 'Romance' },
    { emoji: '⚡', label: 'Action' },
    { emoji: '👻', label: 'Horror' },
    { emoji: '🤣', label: 'Comedy' },
    { emoji: '🎭', label: 'Drama' },
  ]

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood)
    setLoading(true)
    setRecommendations([])
    setError('')

    try {
      // Call real Flask ML API!
      const data = await getRecommendationsAPI(mood)
      if (data.success) {
        setRecommendations(data.movies)
      }
    } catch (err) {
      setError('Something went wrong. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recommend-container">
      <Navbar />
      <div className="recommend-body">
        <h2 className="page-title">🎯 AI Movie Recommender</h2>
        <p className="page-subtitle">
          Tell us your mood — our AI picks the perfect movie for you!
          <span style={{color:'var(--accent)', marginLeft:'8px'}}>🤖 Powered by Cosine Similarity + K-Means</span>
        </p>

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

        {/* Loading */}
        {loading && (
          <div className="loading-box">
            🤖 AI is finding perfect movies for your {selectedMood} mood...
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{color:'#ef4444', textAlign:'center', padding:'20px'}}>
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && recommendations.length > 0 && (
          <div className="results-section">
            <h3>
              Perfect picks for your <span style={{color:'var(--accent)'}}>{selectedMood}</span> mood 🎬
            </h3>
            <div className="recommend-grid">
              {recommendations.map((movie, index) => (
                <div key={index} className="rec-movie-card">
                  <div className="rec-movie-poster">🎬</div>
                  <div className="rec-movie-info">
                    <div className="rec-movie-title">{movie.title}</div>
                    <div className="rec-movie-genre">{movie.genre}</div>
                    <div className="rec-movie-meta">
                      <span className="rec-platform">{movie.platform}</span>
                      <span className="rec-rating">⭐ {movie.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Recommend