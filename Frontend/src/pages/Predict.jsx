// Predict.jsx - Hit or flop predictor
import { useState } from 'react'
import Navbar from '../components/Navbar'
import './Predict.css'

const Predict = () => {
  const [theme, setTheme] = useState('dark')
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    budget: '',
    platform: '',
    language: '',
    castPopularity: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePredict = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    // Static prediction — will connect to Flask ML later
    setTimeout(() => {
      const score = Math.random()
      let prediction, emoji, color

      if (score > 0.65) {
        prediction = 'HIT 🔥'
        emoji = '🏆'
        color = 'hit'
      } else if (score > 0.35) {
        prediction = 'AVERAGE 😐'
        emoji = '📊'
        color = 'average'
      } else {
        prediction = 'FLOP 💀'
        emoji = '📉'
        color = 'flop'
      }

      setResult({
        prediction,
        emoji,
        color,
        confidence: Math.floor(score * 100),
        reasons: [
          `Genre "${formData.genre}" performs well in current market`,
          `Budget range is ${score > 0.5 ? 'appropriate' : 'risky'} for this type`,
          `${formData.platform} platform has ${score > 0.5 ? 'high' : 'moderate'} reach`,
          `Cast popularity score: ${formData.castPopularity}/10`
        ]
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className={`predict-container ${theme}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="predict-body">
        <h2 className="page-title">📊 Hit or Flop Predictor</h2>
        <p className="page-subtitle">Enter movie details — AI predicts if it will be a blockbuster or disaster!</p>

        <div className="predict-layout">
          {/* Form */}
          <div className="predict-form-card">
            <h3>Movie Details</h3>
            <form onSubmit={handlePredict} className="predict-form">
              <div className="form-group">
                <label>Movie / Show Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Stree 4"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <select name="genre" value={formData.genre} onChange={handleChange} required>
                  <option value="">Select genre</option>
                  <option>Action</option>
                  <option>Comedy</option>
                  <option>Horror</option>
                  <option>Romance</option>
                  <option>Thriller</option>
                  <option>Drama</option>
                  <option>Sci-Fi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Budget (in Crores ₹)</label>
                <input
                  type="number"
                  name="budget"
                  placeholder="e.g. 150"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Platform</label>
                <select name="platform" value={formData.platform} onChange={handleChange} required>
                  <option value="">Select platform</option>
                  <option>Theatre</option>
                  <option>Netflix</option>
                  <option>Amazon Prime</option>
                  <option>Hotstar</option>
                  <option>JioCinema</option>
                </select>
              </div>
              <div className="form-group">
                <label>Language</label>
                <select name="language" value={formData.language} onChange={handleChange} required>
                  <option value="">Select language</option>
                  <option>Hindi</option>
                  <option>Telugu</option>
                  <option>Tamil</option>
                  <option>Malayalam</option>
                  <option>English</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cast Popularity (1-10)</label>
                <input
                  type="number"
                  name="castPopularity"
                  placeholder="e.g. 8"
                  min="1"
                  max="10"
                  value={formData.castPopularity}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="predict-btn" disabled={loading}>
                {loading ? '🤖 Predicting...' : '🔮 Predict Now'}
              </button>
            </form>
          </div>

          {/* Result */}
          <div className="predict-result-area">
            {!result && !loading && (
              <div className="predict-placeholder">
                <div className="placeholder-icon">🎬</div>
                <p>Fill in the movie details and click Predict to see the AI prediction!</p>
              </div>
            )}

            {loading && (
              <div className="predict-placeholder">
                <div className="placeholder-icon">🤖</div>
                <p>AI is analysing the movie details...</p>
              </div>
            )}

            {result && (
              <div className={`result-box result-${result.color}`}>
                <div className="result-emoji-big">{result.emoji}</div>
                <h2 className="result-prediction">{result.prediction}</h2>
                <p className="result-confidence">
                  Confidence: {result.confidence}%
                </p>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{width: `${result.confidence}%`}}
                  ></div>
                </div>
                <div className="result-reasons">
                  <h4>Why this prediction?</h4>
                  {result.reasons.map((reason, i) => (
                    <div key={i} className="reason-item">
                      ✓ {reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Predict