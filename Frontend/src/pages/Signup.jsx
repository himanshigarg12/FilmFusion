import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signupAPI } from '../services/api'
import AuthLayout from '../components/AuthLayout'

const getStrength = (pw) => {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++
  return score // 0 to 4
}
const LABELS = ['Too short', 'Weak', 'Okay', 'Good', 'Strong']

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const strength = formData.password ? getStrength(formData.password) : 0
  const matches = formData.confirmPassword && formData.password === formData.confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password.length < 6) return setError('Password must be at least 6 characters.')
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.')

    setLoading(true)
    try {
      const data = await signupAPI(formData.name, formData.email, formData.password)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="auth2-card">
        <h2>Create your account</h2>
        <p className="auth2-sub">Join FilmFusion. It's free</p>

        {error && <div key={error} className="auth2-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth2-field">
            <input id="name" type="text" name="name" placeholder=" "
              value={formData.name} onChange={handleChange} required />
            <label htmlFor="name">Full name</label>
          </div>

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

          {formData.password && (
            <div className="auth2-strength">
              <div className="auth2-strength-bars">
                {[1, 2, 3, 4].map(n => (
                  <span key={n} className={n <= strength ? `on s${strength}` : ''} />
                ))}
              </div>
              <small>{LABELS[strength]}</small>
            </div>
          )}

          <div className="auth2-field">
            <input id="confirmPassword" type={showPassword ? 'text' : 'password'}
              name="confirmPassword" placeholder=" "
              value={formData.confirmPassword} onChange={handleChange} required />
            <label htmlFor="confirmPassword">Confirm password</label>
            {matches && <span className="auth2-tick">✓</span>}
          </div>

          <button type="submit" className="auth2-btn" disabled={loading}>
            {loading ? <span className="auth2-spinner" /> : 'Create account'}
          </button>
        </form>

        <p className="auth2-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Signup