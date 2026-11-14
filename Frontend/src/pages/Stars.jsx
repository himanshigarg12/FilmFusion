import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { getCelebritiesAPI } from '../services/api'
import './Stars.css'

const Stars = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [followedStars, setFollowedStars] = useState([])
  const [celebrities, setCelebrities] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Fetch real celebrities from TMDB via Flask
  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const data = await getCelebritiesAPI()
        if (data.success) {
          setCelebrities(data.celebrities)
        }
      } catch (err) {
        console.log('Using static celebrities')
      } finally {
        setLoading(false)
      }
    }
    fetchCelebrities()

    // Load followed stars from localStorage
    const saved = localStorage.getItem('filmfusion_followed_stars')
    if (saved) {
      setFollowedStars(JSON.parse(saved))
    }
  }, [])

  const toggleFollow = (celebrity) => {
    let updated
    if (followedStars.find(s => s.id === celebrity.id)) {
      updated = followedStars.filter(s => s.id !== celebrity.id)
    } else {
      updated = [...followedStars, celebrity]
    }
    setFollowedStars(updated)
    localStorage.setItem('filmfusion_followed_stars', JSON.stringify(updated))
  }

  const isFollowed = (id) => followedStars.some(s => s.id === id)

  const filteredCelebrities = celebrities.filter(star =>
    star.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <div className="stars-container">
      <Navbar />
      <div className="stars-body">
        <h2 className="page-title">⭐ Bollywood & Hollywood Stars</h2>
        <p className="page-subtitle">
          Follow your favourite celebrities — powered by TMDB!
          <span style={{color:'var(--accent)', marginLeft:'8px'}}>• Live data</span>
        </p>

        {/* Following section */}
        {followedStars.length > 0 && (
          <div className="following-section">
            <h3>👤 You are following ({followedStars.length})</h3>
            <div className="following-grid">
              {followedStars.map(star => (
                <div key={star.id} className="following-card">
                  {star.photo ? (
                    <img
                      src={star.photo}
                      alt={star.name}
                      className="star-photo"
                      onError={(e) => { e.target.style.display='none' }}
                    />
                  ) : (
                    <div className="star-avatar-big">{getInitials(star.name)}</div>
                  )}
                  <div className="following-info">
                    <div className="star-name-big">{star.name}</div>
                    <div className="next-movie">🎬 {star.known_for_movies?.[0] || 'Actor'}</div>
                    <div className="release-date">⭐ Popularity: {star.popularity}</div>
                  </div>
                  <button
                    className="unfollow-btn"
                    onClick={() => toggleFollow(star)}
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Search celebrities..."
          className="stars-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* All celebrities */}
        <h3 className="all-stars-title">
          🌟 Popular Celebrities
          {!loading && <span style={{fontSize:'13px', color:'var(--accent)', marginLeft:'8px'}}>• {celebrities.length} found</span>}
        </h3>

        {loading ? (
          <div style={{textAlign:'center', padding:'40px', color:'var(--text2)'}}>
            Loading celebrities... ⭐
          </div>
        ) : (
          <div className="stars-grid">
            {filteredCelebrities.map(star => (
              <div key={star.id} className="star-card-big">
                {star.photo ? (
                  <img
                    src={star.photo}
                    alt={star.name}
                    className="star-real-photo"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="star-avatar-large"
                  style={{display: star.photo ? 'none' : 'flex'}}
                >
                  {getInitials(star.name)}
                </div>
                <div className="star-card-name">{star.name}</div>
                <div className="star-card-role">{star.known_for}</div>
                <div className="star-card-movies">
                  {star.known_for_movies?.join(', ') || 'Actor'}
                </div>
                <div className="star-popularity">
                  🔥 Popularity: {star.popularity}
                </div>
                <button
                  className={`follow-btn ${isFollowed(star.id) ? 'following' : ''}`}
                  onClick={() => toggleFollow(star)}
                >
                  {isFollowed(star.id) ? '✓ Following' : '+ Follow'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Stars