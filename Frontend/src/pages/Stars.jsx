// Stars.jsx - Follow celebrities page
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import './Stars.css'

const Stars = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [followedStars, setFollowedStars] = useState([
    'Shah Rukh Khan',
    'Deepika Padukone'
  ])
  const [activeTab, setActiveTab] = useState('all')

  const { user } = useAuth()

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

  // New faces data - YouTubers/new entrants in Bollywood
  const newFaces = [
    {
      name: 'Elvish Yadav',
      initials: 'EY',
      from: 'YouTube',
      followers: '12M+ YouTube',
      debutMovie: 'Elvish - The Journey',
      releaseDate: 'Dec 2026',
      genre: 'Action Drama',
      budget: '25',
      castPopularity: 7,
      prediction: 'HIT 🔥',
      predictionColor: 'hit',
      confidence: 72,
      news: 'Elvish Yadav signs his debut Bollywood film after massive YouTube success',
      emoji: '🎬'
    },
    {
      name: 'Carry Minati',
      initials: 'CM',
      from: 'YouTube',
      followers: '40M+ YouTube',
      debutMovie: 'Roast - The Movie',
      releaseDate: 'Mar 2027',
      genre: 'Comedy',
      budget: '30',
      castPopularity: 8,
      prediction: 'HIT 🔥',
      predictionColor: 'hit',
      confidence: 78,
      news: 'CarryMinati announces his Bollywood debut with a comedy film',
      emoji: '😂'
    },
    {
      name: 'Bhuvan Bam',
      initials: 'BB',
      from: 'YouTube',
      followers: '20M+ YouTube',
      debutMovie: 'BB Ki Vines - Film',
      releaseDate: 'Jun 2027',
      genre: 'Comedy Drama',
      budget: '20',
      castPopularity: 7,
      prediction: 'AVERAGE 😐',
      predictionColor: 'average',
      confidence: 58,
      news: 'Bhuvan Bam returns to big screen after Taaza Khabar success',
      emoji: '🎭'
    },
    {
      name: 'Orry (Orhan Awatramani)',
      initials: 'OR',
      from: 'Social Media',
      followers: '5M+ Instagram',
      debutMovie: 'The Social Star',
      releaseDate: 'Sep 2027',
      genre: 'Drama',
      budget: '15',
      castPopularity: 5,
      prediction: 'AVERAGE 😐',
      predictionColor: 'average',
      confidence: 45,
      news: 'Social media personality Orry reportedly in talks for Bollywood debut',
      emoji: '✨'
    },
    {
      name: 'Munawar Faruqui',
      initials: 'MF',
      from: 'Bigg Boss',
      followers: '8M+ Instagram',
      debutMovie: 'Stand Up',
      releaseDate: 'Nov 2026',
      genre: 'Comedy',
      budget: '18',
      castPopularity: 6,
      prediction: 'HIT 🔥',
      predictionColor: 'hit',
      confidence: 65,
      news: 'Bigg Boss 17 winner Munawar Faruqui to make Bollywood debut',
      emoji: '🎤'
    },
    {
      name: 'Mannara Chopra',
      initials: 'MC',
      from: 'Bigg Boss',
      followers: '3M+ Instagram',
      debutMovie: 'New Beginnings',
      releaseDate: 'Feb 2027',
      genre: 'Romance',
      budget: '20',
      castPopularity: 6,
      prediction: 'AVERAGE 😐',
      predictionColor: 'average',
      confidence: 52,
      news: 'Mannara Chopra eyeing big Bollywood projects after Bigg Boss fame',
      emoji: '💕'
    },
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
    <div className="stars-container">
      <Navbar />

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

        {/* Tabs */}
        <div className="stars-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            🌟 All Celebrities
          </button>
          <button
            className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            🆕 New Faces in Bollywood
          </button>
        </div>

        {/* ALL CELEBRITIES TAB */}
        {activeTab === 'all' && (
          <>
            <input
              type="text"
              placeholder="Search celebrities..."
              className="stars-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
          </>
        )}

        {/* NEW FACES TAB */}
        {activeTab === 'new' && (
          <div className="new-faces-section">
            <div className="new-faces-header">
              <p className="new-faces-subtitle">
                🤖 AI predicts if their debut movie will be a HIT or FLOP based on their popularity, genre, and market analysis!
              </p>
            </div>

            <div className="new-faces-grid">
              {newFaces.map(face => (
                <div key={face.name} className="new-face-card">
                  {/* Header */}
                  <div className="new-face-header">
                    <div className="new-face-avatar">{face.initials}</div>
                    <div className="new-face-info">
                      <div className="new-face-name">{face.name}</div>
                      <div className="new-face-from">
                        📱 From: {face.from}
                      </div>
                      <div className="new-face-followers">{face.followers}</div>
                    </div>
                    <div className="new-face-emoji">{face.emoji}</div>
                  </div>

                  {/* Movie details */}
                  <div className="new-face-movie">
                    <div className="movie-detail-row">
                      <span>🎬 Debut Movie:</span>
                      <strong>{face.debutMovie}</strong>
                    </div>
                    <div className="movie-detail-row">
                      <span>🎭 Genre:</span>
                      <strong>{face.genre}</strong>
                    </div>
                    <div className="movie-detail-row">
                      <span>📅 Release:</span>
                      <strong>{face.releaseDate}</strong>
                    </div>
                    <div className="movie-detail-row">
                      <span>💰 Budget:</span>
                      <strong>₹{face.budget} Cr</strong>
                    </div>
                  </div>

                  {/* AI Prediction */}
                  <div className={`ai-prediction prediction-${face.predictionColor}`}>
                    <div className="prediction-label">🤖 AI Predicts:</div>
                    <div className="prediction-result">{face.prediction}</div>
                    <div className="prediction-bar-container">
                      <div
                        className="prediction-bar-fill"
                        style={{width: `${face.confidence}%`}}
                      ></div>
                    </div>
                    <div className="prediction-confidence">
                      Confidence: {face.confidence}%
                    </div>
                  </div>

                  {/* Latest news */}
                  <div className="new-face-news">
                    <span>📰</span>
                    <p>{face.news}</p>
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

export default Stars