import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { getTrendingMoviesAPI } from '../services/api'
import './Home.css'

import TiltCard from '../components/TiltCard'

const Home = () => {
  const { user } = useAuth()
 
  const [trendingMovies, setTrendingMovies] = useState([])
  const [loading, setLoading] = useState(true)

  // Static followed stars
  const followedStars = [
    { id: 1, name: 'Shah Rukh Khan', initials: 'SRK', nextMovie: 'King', releaseDate: 'Aug 2026' },
    { id: 2, name: 'Deepika Padukone', initials: 'DP', nextMovie: 'Singham 3', releaseDate: 'Dec 2026' },
    { id: 3, name: 'Ranbir Kapoor', initials: 'RK', nextMovie: 'Ramayana', releaseDate: 'Jan 2027' },
  ]

  const moods = ['😂 Funny', '😢 Emotional', '😱 Thriller', '💕 Romance', '⚡ Action', '👻 Horror']

  // Fetch real trending movies from Flask → TMDB API
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingMoviesAPI()
        if (data.success && data.movies.length > 0) {
          setTrendingMovies(data.movies.slice(0, 5))
        }
      } catch (error) {
        console.log('Using static data')
        setTrendingMovies([
          { id: 1, title: 'Stree 3', genre_ids: [], rating: 8.2, emoji: '👻', badge: 'Hit' },
          { id: 2, title: 'Pushpa 3', genre_ids: [], rating: 8.9, emoji: '🔥', badge: 'Hit' },
          { id: 3, title: 'King', genre_ids: [], rating: 9.1, emoji: '👑', badge: 'Upcoming' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchTrending()
  }, [])

  return (
    <div className="home-container">
      
      <Navbar />
      <div className="home-body">

        {/* Welcome banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
            <p>Discover movies, shows and get AI-powered recommendations</p>
          </div>
          <div className="welcome-actions">
            <Link to="/recommend" className="action-btn primary">🎯 Get Recommendations</Link>
            <Link to="/predict" className="action-btn secondary">📊 Predict Hit or Flop</Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">🎬</span>
            <div><div className="stat-value">10,000+</div><div className="stat-label">Movies & Shows</div></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📺</span>
            <div><div className="stat-value">5,200+</div><div className="stat-label">OTT Originals</div></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <div><div className="stat-value">2,500+</div><div className="stat-label">Celebrities</div></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🤖</span>
            <div><div className="stat-value">87%</div><div className="stat-label">AI Accuracy</div></div>
          </div>
        </div>

        {/* Trending movies - REAL DATA from TMDB! */}
        <div className="section">
          <div className="section-header">
            <h3>🔥 Trending Now {!loading && <span style={{fontSize:'12px', color:'var(--accent)'}}>• Live from TMDB</span>}</h3>
            <Link to="/explore" className="see-all">See all</Link>
          </div>

          {loading ? (
            <div style={{textAlign:'center', padding:'20px', color:'var(--text2)'}}>
              Loading real trending movies... 🎬
            </div>
          ) : (
            <div className="movies-grid">
              {trendingMovies.map(movie => (
                <TiltCard key={movie.id} className="movie-card">
                  {/* Show real poster if available */}
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="movie-poster-img"
                      onError={(e) => { e.target.style.display='none' }}
                    />
                  ) : (
                    <div className="movie-poster">{movie.emoji || '🎬'}</div>
                  )}
                  <div className="movie-info">
                    <div className="movie-title">{movie.title}</div>
                    <div className="movie-meta">
                      <span className="movie-genre">{movie.release_date?.split('-')[0] || 'New'}</span>
                      <span className="movie-rating">⭐ {movie.rating}</span>
                    </div>
                    <span className="badge badge-hit">{movie.badge || 'Trending'}</span>
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </div>

        {/* AI features row */}
        <div className="ai-row">
          <div className="ai-card">
            <h3>🎯 Mood Recommender</h3>
            <p>Pick your mood — get perfect picks</p>
            <div className="mood-grid">
              {moods.map((mood, index) => (
                <Link to="/recommend" key={index} className="mood-btn">{mood}</Link>
              ))}
            </div>
          </div>
          <div className="ai-card">
            <h3>💬 Audience Sentiment</h3>
            <p>What people think about trending shows</p>
            <div className="sentiment-list">
              <div className="sentiment-item">
                <div className="sent-info"><span>Stree 3</span><span className="sent-positive">92% positive</span></div>
                <div className="sent-bar"><div className="sent-fill positive" style={{width:'92%'}}></div></div>
              </div>
              <div className="sentiment-item">
                <div className="sent-info"><span>Lockup 2</span><span className="sent-neutral">78% positive</span></div>
                <div className="sent-bar"><div className="sent-fill neutral" style={{width:'78%'}}></div></div>
              </div>
              <div className="sentiment-item">
                <div className="sent-info"><span>Bigg Boss 19</span><span className="sent-warning">61% positive</span></div>
                <div className="sent-bar"><div className="sent-fill warning" style={{width:'61%'}}></div></div>
              </div>
            </div>
            <Link to="/analyse" className="analyse-btn">Analyse any show →</Link>
          </div>
        </div>

        {/* Followed stars */}
        <div className="section">
          <div className="section-header">
            <h3>⭐ Your Followed Stars</h3>
            <Link to="/stars" className="see-all">Follow more</Link>
          </div>
          <div className="stars-row">
            {followedStars.map(star => (
              <div key={star.id} className="star-card">
                <div className="star-avatar">{star.initials}</div>
                <div className="star-info">
                  <div className="star-name">{star.name}</div>
                  <div className="star-next">Next: {star.nextMovie} → {star.releaseDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home