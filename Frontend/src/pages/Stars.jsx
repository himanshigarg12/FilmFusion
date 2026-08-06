// Stars.jsx - Follow celebrities page
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import './Stars.css'

const Stars = () => {
  const [theme, setTheme] = useState('dark')
  const [searchQuery, setSearchQuery] = useState('')
  const [followedStars, setFollowedStars] = useState([
    'Shah Rukh Khan',
    'Deepika Padukone'
  ])

  const { user } = useAuth()
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  // All celebrities data
  const allStars = [
    { name: 'Shah Rukh Khan', initials: 'SRK', role: 'Actor', nextMovie: 'King', releaseDate: 'Aug 2026', movies: 90 },
    { name: 'Deepika Padukone', initials: 'DP', role: 'Actress', nextMovie: 'Singham 3', releaseDate: 'Dec 2026', movies: 35 },
    { name: 'Ranbir Kapoor', initials: 'RK', role: 'Actor', nextMovie: 'Ramayana', releaseDate: 'Jan 2027', movies: 20 },
    { name: 'Alia Bhatt', initials: 'AB', role: 'Actress', nextMovie: 'Jigra 2', releaseDate: 'Mar 2027', movies: 25 },
    { name: 'Salman Khan', initials: 'SK', role: 'Actor', nextMovie: 'Sikandar 2', releaseDate: 'Eid 2027', movies: 100 },
    { name: 'Priyanka Chopra', initials: 'PC', role: 'Actress', nextMovie: 'Heads of State', releaseDate: 'Jul 2026', movies: 60 },
    { name: 'Ranveer Singh', initials: 'RS', role: 'Actor', nextMovie: 'Don 3', releaseDate: 'Dec 2026', movies: 18 },
    { name: 'Katrina Kaif', initials: 'KK', role: 'Actress', nextMovie: 'Tiger 4', releaseDate: '2027', movies: 40 },
    { name: 'Vijay Deverakonda', initials: 'VD', role: 'Actor', nextMovie: 'VD12', releaseDate: '2027', movies: 12 },
    { name: 'Rashmika Mandanna', initials: 'RM', role: 'Actress', nextMovie: 'Pushpa 3', releaseDate: '2027', movies: 20 },
    { name: 'Prabhas', initials: 'PB', role: 'Actor', nextMovie: 'Spirit', releaseDate: '2027', movies: 25 },
    { name: 'Shraddha Kapoor', initials: 'SH', role: 'Actress', nextMovie: 'Stree 4', releaseDate: '2028', movies: 30 },
  ]

  const toggleFollow = (starName) => {
    if (followedStars.includes(starName)) {
      setFollowedStars(followedStars.filter(s => s !== starName))
    } else {
      setFollowedStars([...followedStars, starName])
    }
  }

  const filteredStars = allStars.filter(star =>
    star.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const myFollowedStars = allStars.filter(s => followedStars.includes(s.name))

  return (
    <div className={`stars-container ${theme}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="stars-body">
        <h2 className="page-title">⭐ Bollywood Stars</h2>
        <p className="page-subtitle">Follow your favourite celebrities and never miss their next movie!</p>

        {/* My followed stars */}
        {myFollowedStars.length > 0 && (
          <div className="following-section">
            <h3>👤 You are following ({myFollowedStars.length})</h3>
            <div className="following-grid">
              {myFollowedStars.map(star => (
                <div key={star.name} className="following-card">
                  <div className="star-avatar-big">{star.initials}</div>
                  <div className="following-info">
                    <div className="star-name-big">{star.name}</div>
                    <div className="next-movie">
                      🎬 Next: <strong>{star.nextMovie}</strong>
                    </div>
                    <div className="release-date">
                      📅 {star.releaseDate}
                    </div>
                  </div>
                  <button
                    className="unfollow-btn"
                    onClick={() => toggleFollow(star.name)}
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

        {/* All stars grid */}
        <h3 className="all-stars-title">🌟 All Celebrities</h3>
        <div className="stars-grid">
          {filteredStars.map(star => (
            <div key={star.name} className="star-card-big">
              <div className="star-avatar-large">{star.initials}</div>
              <div className="star-card-name">{star.name}</div>
              <div className="star-card-role">{star.role}</div>
              <div className="star-card-movies">{star.movies} movies</div>
              <div className="star-next-movie">
                Next: {star.nextMovie} ({star.releaseDate})
              </div>
              <button
                className={`follow-btn ${followedStars.includes(star.name) ? 'following' : ''}`}
                onClick={() => toggleFollow(star.name)}
              >
                {followedStars.includes(star.name) ? '✓ Following' : '+ Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stars