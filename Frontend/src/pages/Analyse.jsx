// Analyse.jsx - Sentiment analysis page
import { useState } from 'react'
import Navbar from '../components/Navbar'
import './Analyse.css'

const Analyse = () => {
  const [theme, setTheme] = useState('dark')
  const [review, setReview] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleAnalyse = async () => {
    if (!review.trim()) return
    setLoading(true)
    setResult(null)

    // Static result for now — will connect to Flask ML later
    setTimeout(() => {
      const positive = Math.floor(Math.random() * 40) + 60
      const negative = Math.floor(Math.random() * 20)
      const neutral = 100 - positive - negative

      setResult({
        sentiment: positive > 70 ? 'Positive' : positive > 50 ? 'Neutral' : 'Negative',
        emoji: positive > 70 ? '😍' : positive > 50 ? '😐' : '😤',
        positive,
        negative,
        neutral,
        confidence: positive > 70 ? 'High' : 'Medium'
      })
      setLoading(false)
    }, 1500)
  }

  const trendingSentiments = [
    { title: 'Stree 3', positive: 92, emoji: '👻' },
    { title: 'Pushpa 3', positive: 88, emoji: '🔥' },
    { title: 'Lockup 2', positive: 78, emoji: '🔒' },
    { title: 'Bigg Boss 19', positive: 61, emoji: '📺' },
    { title: 'King', positive: 95, emoji: '👑' },
  ]

  return (
    <div className={`analyse-container ${theme}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="analyse-body">
        <h2 className="page-title">💬 Review Sentiment Analyser</h2>
        <p className="page-subtitle">Paste any review — AI tells you if audience loves or hates it!</p>

        {/* Input section */}
        <div className="analyse-card">
          <h3>Paste a review or comment</h3>
          <textarea
            className="review-input"
            placeholder="Example: Stree 3 is absolutely amazing! Best horror comedy of the decade. Shraddha Kapoor is brilliant!"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
          />
          <button
            className="analyse-btn"
            onClick={handleAnalyse}
            disabled={loading || !review.trim()}
          >
            {loading ? '🤖 Analysing...' : '🔍 Analyse Sentiment'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`result-card result-${result.sentiment.toLowerCase()}`}>
            <div className="result-header">
              <span className="result-emoji">{result.emoji}</span>
              <div>
                <h3>Sentiment: {result.sentiment}</h3>
                <p>Confidence: {result.confidence}</p>
              </div>
            </div>
            <div className="result-bars">
              <div className="result-bar-item">
                <div className="bar-label">
                  <span>Positive</span>
                  <span className="positive-text">{result.positive}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill positive-fill" style={{width: `${result.positive}%`}}></div>
                </div>
              </div>
              <div className="result-bar-item">
                <div className="bar-label">
                  <span>Neutral</span>
                  <span className="neutral-text">{result.neutral}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill neutral-fill" style={{width: `${result.neutral}%`}}></div>
                </div>
              </div>
              <div className="result-bar-item">
                <div className="bar-label">
                  <span>Negative</span>
                  <span className="negative-text">{result.negative}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill negative-fill" style={{width: `${result.negative}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trending sentiments */}
        <div className="trending-section">
          <h3>📊 Trending Show Sentiments</h3>
          <div className="trending-list">
            {trendingSentiments.map((item, index) => (
              <div key={index} className="trending-item">
                <span className="trending-emoji">{item.emoji}</span>
                <span className="trending-title">{item.title}</span>
                <div className="trending-bar">
                  <div
                    className="trending-fill"
                    style={{width: `${item.positive}%`}}
                  ></div>
                </div>
                <span className="trending-percent">{item.positive}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analyse