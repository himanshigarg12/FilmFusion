import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { searchMoviesAPI } from '../services/api'
import './Navbar.css'

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const boxRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  // Wait 400ms after typing stops, then search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    const timer = setTimeout(async () => {
      try {
        const data = await searchMoviesAPI(query.trim())
        setResults(data.success ? data.movies.slice(0, 6) : [])
      } catch (err) {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Enter key → open full results on Explore page
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    navigate(`/explore?q=${encodeURIComponent(query.trim())}`)
  }

  const handlePick = (movie) => {
    setOpen(false)
    setQuery('')
    navigate(`/explore?q=${encodeURIComponent(movie.title)}`)
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">🎬 FilmFusion</Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/explore" className={`nav-link ${isActive('/explore') ? 'active' : ''}`}>Explore</Link>
        <Link to="/recommend" className={`nav-link ${isActive('/recommend') ? 'active' : ''}`}>Recommend</Link>
        <Link to="/analyse" className={`nav-link ${isActive('/analyse') ? 'active' : ''}`}>Analyse</Link>
        <Link to="/predict" className={`nav-link ${isActive('/predict') ? 'active' : ''}`}>Predict</Link>
        <Link to="/stars" className={`nav-link ${isActive('/stars') ? 'active' : ''}`}>Stars</Link>
      </div>

      <div className="nav-right">
        {/* Working search box */}
        <div className="nav-search-wrap" ref={boxRef}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="🔍 Search movies..."
              className="nav-search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
            />
          </form>

          {open && query.trim().length >= 2 && (
            <div className="search-dropdown">
              {searching && <div className="search-msg">Searching...</div>}

              {!searching && results.length === 0 && (
                <div className="search-msg">No movies found for "{query}"</div>
              )}

              {!searching && results.map(movie => (
                <div key={movie.id} className="search-item" onClick={() => handlePick(movie)}>
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} />
                  ) : (
                    <div className="search-noposter">🎬</div>
                  )}
                  <div className="search-info">
                    <div className="search-title">{movie.title}</div>
                    <div className="search-meta">
                      {movie.release_date?.split('-')[0] || 'N/A'} • ⭐ {movie.rating}
                    </div>
                  </div>
                </div>
              ))}

              {!searching && results.length > 0 && (
                <div className="search-all" onClick={handleSubmit}>
                  See all results for "{query}" →
                </div>
              )}
            </div>
          )}
        </div>

        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        <div className="nav-user">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <span className="user-name">{user?.name?.split(' ')[0]}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar