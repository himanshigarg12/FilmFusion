import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAPI } from '../services/api'
import AuthLayout from '../components/AuthLayout'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
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
    setLoading(true)
    try {
      const data = await loginAPI(formData.email, formData.password)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="auth2-card">
        <h2>Welcome back</h2>
        <p className="auth2-sub">Login to continue your movie journey</p>

        {error && <div key={error} className="auth2-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth2-field">
            <input id="email" type="email" name="email" placeholder=" "
              value={formData.email} onChange={handleChange} required />
            <label htmlFor="email">Email address</label>
          </div>

          <div className="auth2-field">
            <input id="password" type={showPassword ? 'text' : 'password'} name="password"
              placeholder=" " value={formData.password} onChange={handleChange} required />
            <label htmlFor="password">Password</label>
            <button type="button" className="auth2-eye"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit" className="auth2-btn" disabled={loading}>
            {loading ? <span className="auth2-spinner" /> : 'Login'}
          </button>
        </form>

        <p className="auth2-switch">
          New to FilmFusion? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login