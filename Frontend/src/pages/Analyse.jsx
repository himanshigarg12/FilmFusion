import { useState } from 'react'
import Navbar from '../components/Navbar'
import { analyseSentimentAPI } from '../services/api'
import './Analyse.css'

const Analyse = () => {
  const [review, setReview] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyse = async () => {
    if (!review.trim()) return
    setLoading(true)
    setResult(null)
    setError('')

    try {
      // Call real Flask ML API!
      const data = await analyseSentimentAPI(review)
      if (data.success) {
        setResult(data.result)
      }
    } catch (err) {
      setError('Something went wrong. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  const trendingSentiments = [
    { title: 'Stree 3', positive: 92, emoji: '👻' },
    { title: 'Pushpa 3', positive: 88, emoji: '🔥' },
    { title: 'Lockup 2', positive: 78, emoji: '🔒' },
    { title: 'Bigg Boss 19', positive: 61, emoji: '📺' },
    { title: 'King', positive: 95, emoji: '👑' },
  ]

  const sampleReviews = [
    "Stree 3 is absolutely amazing! Best horror comedy ever made!",
    "Terrible movie, complete waste of time and money!",
    "Shah Rukh Khan was brilliant in King. Loved every minute!",
    "Very disappointing. Expected much better from this director."
  ]

  return (
    <div className="analyse-container">
      <Navbar />

      <div className="analyse-body">
        <h2 className="page-title">💬 Review Sentiment Analyser</h2>
        <p className="page-subtitle">
          Paste any movie or show review — our AI tells you if audience loves or hates it!
          <span style={{color:'var(--accent)', marginLeft:'8px'}}>🤖 Powered by Logistic Regression (89% accuracy)</span>
        </p>

        {/* Sample reviews */}
        <div className="sample-reviews">
          <p style={{fontSize:'13px', color:'var(--text2)', marginBottom:'8px'}}>
            💡 Try these sample reviews:
          </p>
          <div className="sample-btns">
            {sampleReviews.map((sample, i) => (
              <button
                key={i}
                className="sample-btn"
                onClick={() => setReview(sample)}
              >
                {sample.substring(0, 40)}...
              </button>
            ))}
          </div>
        </div>

        {/* Input section */}
        <div className="analyse-card">
          <h3>Paste a review or comment</h3>
          <textarea
            className="review-input"
            placeholder="Example: Stree 3 is absolutely amazing! Best horror comedy of the decade..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
          />

          {error && (
            <div style={{color:'#ef4444', fontSize:'13px', marginBottom:'10px'}}>
              {error}
            </div>
          )}

          <button
            className="analyse-btn"
            onClick={handleAnalyse}
            disabled={loading || !review.trim()}
          >
            {loading ? '🤖 AI is analysing...' : '🔍 Analyse Sentiment'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`result-card result-${result.sentiment.toLowerCase()}`}>
            <div className="result-header">
              <span className="result-emoji">{result.emoji}</span>
              <div>
                <h3>Sentiment: {result.sentiment}</h3>
                <p>Confidence: {result.confidence} • Model: {result.model_used}</p>
              </div>
            </div>
            <div className="result-bars">
              <div className="result-bar-item">
                <div className="bar-label">
                  <span>Positive</span>
                  <span className="positive-text">{result.positive}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill positive-fill" style={{width:`${result.positive}%`}}></div>
                </div>
              </div>
              <div className="result-bar-item">
                <div className="bar-label">
                  <span>Neutral</span>
                  <span className="neutral-text">{result.neutral}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill neutral-fill" style={{width:`${result.neutral}%`}}></div>
                </div>
              </div>
              <div className="result-bar-item">
                <div className="bar-label">
                  <span>Negative</span>
                  <span className="negative-text">{result.negative}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill negative-fill" style={{width:`${result.negative}%`}}></div>
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
                  <div className="trending-fill" style={{width:`${item.positive}%`}}></div>
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