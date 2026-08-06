// ProtectedRoute.jsx - Guards private pages
// If user is NOT logged in → redirect to login page
// If user IS logged in → show the page normally
// Think of this as a security guard for each page! 💂

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()

  // If user is not logged in → send to login page
  if (!user) {
    return <Navigate to="/login" />
  }

  // If user is logged in → show the page
  return children
}

export default ProtectedRoute