// Signup.jsx - Signup page
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signupAPI } from '../services/api'
import './Login.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match!')
    }

    setLoading(true)
    try {
      const data = await signupAPI(formData.name, formData.email, formData.password)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed! Please try again.')
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

      {/* Right side - signup form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Create account</h2>
          <p className="auth-subtitle">Join FilmFusion today — it's free!</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
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
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup