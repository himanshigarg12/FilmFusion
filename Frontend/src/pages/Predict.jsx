import { useState } from 'react'
import Navbar from '../components/Navbar'
import { predictHitFlopAPI } from '../services/api'
import './Predict.css'

const Predict = () => {
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
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePredict = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError('')

    try {
      // Call real Flask ML API!
      const data = await predictHitFlopAPI(formData)
      if (data.success) {
        setResult(data.result)
      }
    } catch (err) {
      setError('Something went wrong. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  const exampleMovies = [
    { title: 'King', genre: 'Action', budget: '300', platform: 'Theatre', language: 'Hindi', castPopularity: '10' },
    { title: 'Elvish Debut', genre: 'Comedy', budget: '25', platform: 'Theatre', language: 'Hindi', castPopularity: '6' },
    { title: 'Pushpa 3', genre: 'Action', budget: '250', platform: 'Theatre', language: 'Telugu', castPopularity: '9' },
  ]

  return (
    <div className="predict-container">
      <Navbar />
      <div className="predict-body">
        <h2 className="page-title">📊 Hit or Flop Predictor</h2>
        <p className="page-subtitle">
          Enter movie details — AI predicts if it will be a blockbuster or disaster!
          <span style={{color:'var(--accent)', marginLeft:'8px'}}>🤖 Powered by Random Forest</span>
        </p>

        {/* Example movies */}
        <div style={{marginBottom:'20px'}}>
          <p style={{fontSize:'13px', color:'var(--text2)', marginBottom:'8px'}}>💡 Try these examples:</p>
          <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
            {exampleMovies.map((movie, i) => (
              <button
                key={i}
                onClick={() => setFormData(movie)}
                style={{
                  background:'var(--surface)',
                  border:'1px solid var(--border)',
                  borderRadius:'8px',
                  padding:'6px 14px',
                  fontSize:'12px',
                  color:'var(--text2)',
                  cursor:'pointer'
                }}
              >
                {movie.title}
              </button>
            ))}
          </div>
        </div>

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

              {error && <p style={{color:'#ef4444', fontSize:'13px'}}>{error}</p>}

              <button type="submit" className="predict-btn" disabled={loading}>
                {loading ? '🤖 AI is predicting...' : '🔮 Predict Now'}
              </button>
            </form>
          </div>

          {/* Result */}
          <div className="predict-result-area">
            {!result && !loading && (
              <div className="predict-placeholder">
                <div className="placeholder-icon">🎬</div>
                <p>Fill in the movie details and click Predict!</p>
              </div>
            )}

            {loading && (
              <div className="predict-placeholder">
                <div className="placeholder-icon">🤖</div>
                <p>AI is analysing your movie details...</p>
              </div>
            )}

            {result && (
              <div className={`result-box result-${result.color}`}>
                <div className="result-emoji-big">{result.emoji}</div>
                <h2 className="result-prediction">{result.prediction}</h2>
                <p className="result-confidence">Confidence: {result.confidence}%</p>
                <div className="confidence-bar">
                  <div className="confidence-fill" style={{width:`${result.confidence}%`}}></div>
                </div>
                <div className="result-reasons">
                  <h4>Why this prediction?</h4>
                  {result.reasons?.map((reason, i) => (
                    <div key={i} className="reason-item">✓ {reason}</div>
                  ))}
                </div>
                <p style={{fontSize:'11px', color:'#6b7280', marginTop:'10px'}}>
                  Model: {result.model_used}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Predict