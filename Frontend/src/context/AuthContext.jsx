import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedToken = localStorage.getItem('filmfusion_token')
    const savedUser = localStorage.getItem('filmfusion_user')
    const savedTheme = localStorage.getItem('filmfusion_theme') || 'dark'

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }

    setTheme(savedTheme)
    document.body.className = savedTheme
    setLoading(false)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.body.className = newTheme
    localStorage.setItem('filmfusion_theme', newTheme)
  }

  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('filmfusion_token', userToken)
    localStorage.setItem('filmfusion_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('filmfusion_token')
    localStorage.removeItem('filmfusion_user')
  }

  if (loading) return <div style={{background:'#141414', height:'100vh'}}></div>

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  )
}