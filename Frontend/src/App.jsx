// App.jsx - Main file that controls page navigation
// Think of this as the "map" of your entire website

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthProvider } from './context/AuthContext'

import { useState } from 'react'
import Intro from './components/Intro'

// Import all pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Recommend from './pages/Recommend'
import Analyse from './pages/Analyse'
import Predict from './pages/Predict'
import Stars from './pages/Stars'

// Import protected route component
import ProtectedRoute from './components/ProtectedRoute'

// Import global CSS
import './App.css'

function AppRoutes() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES - anyone can access */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <Signup /> : <Navigate to="/" />} 
        />

        {/* PROTECTED ROUTES - only logged in users */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }/>
        <Route path="/explore" element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        }/>
        <Route path="/recommend" element={
          <ProtectedRoute>
            <Recommend />
          </ProtectedRoute>
        }/>
        <Route path="/analyse" element={
          <ProtectedRoute>
            <Analyse />
          </ProtectedRoute>
        }/>
        <Route path="/predict" element={
          <ProtectedRoute>
            <Predict />
          </ProtectedRoute>
        }/>
        <Route path="/stars" element={
          <ProtectedRoute>
            <Stars />
          </ProtectedRoute>
        }/>

        {/* If unknown route — go to home */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  )
}

// Wrap everything with AuthProvider
// So all pages can access user login state
function App() {
  // Starts as true on every fresh load/refresh, so the intro plays every time
  const [showIntro, setShowIntro] = useState(true)

  return (
    <AuthProvider>
      {showIntro && <Intro onFinish={() => setShowIntro(false)} />}
      <AppRoutes />
    </AuthProvider>
  )
}

export default App