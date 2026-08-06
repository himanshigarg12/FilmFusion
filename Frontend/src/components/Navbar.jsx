import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

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
        <input type="text" placeholder="🔍 Search movies, shows..." className="nav-search" />
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