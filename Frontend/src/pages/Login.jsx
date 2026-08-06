// Login.jsx - Login page
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAPI } from '../services/api'
import './Login.css'

const Login = () => {
  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Error and loading states
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Get login function from AuthContext
  const { login } = useAuth()

  // For redirecting after login
  const navigate = useNavigate()

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call login API
      const data = await loginAPI(formData.email, formData.password)

      // Save user data in context
      login(data.user, data.token)

      // Redirect to home page
      navigate('/')

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed! Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">

      {/* Left side - branding */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">🎬</div>
          <h1>FilmFusion</h1>
          <p>Your AI-powered entertainment hub</p>
        </div>
        <div className="auth-features">
          <div className="feature-item">
            <span>🎯</span>
            <p>AI movie recommendations based on your mood</p>
          </div>
          <div className="feature-item">
            <span>💬</span>
            <p>Analyse audience sentiment of any show</p>
          </div>
          <div className="feature-item">
            <span>📊</span>
            <p>Predict if a movie will be hit or flop</p>
          </div>
          <div className="feature-item">
            <span>⭐</span>
            <p>Follow your favourite Bollywood stars</p>
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Welcome back!</h2>
          <p className="auth-subtitle">Login to continue to FilmFusion</p>

          {/* Error message */}
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">

            {/* Email field */}
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password field */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>

          {/* Link to signup */}
          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/signup">Sign up here</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login