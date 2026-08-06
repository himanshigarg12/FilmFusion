// Explore.jsx - Browse all movies and shows
import { useState } from 'react'
import Navbar from '../components/Navbar'
import MovieCard from '../components/MovieCard'
import './Explore.css'

const Explore = () => {
  const [theme, setTheme] = useState('dark')
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const filters = ['All', 'Bollywood', 'Hollywood', 'OTT', 'Reality Shows', 'Web Series']

  // Static data for now — will connect to TMDB API later
  const allContent = [
    { id: 1, title: 'Stree 3', genre: 'Horror Comedy', rating: '8.2', emoji: '👻', type: 'Bollywood', badge: 'Hit' },
    { id: 2, title: 'Pushpa 3', genre: 'Action', rating: '8.9', emoji: '🔥', type: 'Bollywood', badge: 'Hit' },
    { id: 3, title: 'Lockup 2', genre: 'Reality', rating: '7.5', emoji: '🔒', type: 'Reality Shows', badge: 'OTT' },
    { id: 4, title: 'Bigg Boss 19', genre: 'Reality', rating: '6.8', emoji: '📺', type: 'Reality Shows', badge: 'OTT' },
    { id: 5, title: 'King', genre: 'Action', rating: '9.1', emoji: '👑', type: 'Bollywood', badge: 'Upcoming' },
    { id: 6, title: 'Avengers 5', genre: 'Superhero', rating: '8.5', emoji: '🦸', type: 'Hollywood', badge: 'Upcoming' },
    { id: 7, title: 'Mirzapur 4', genre: 'Crime', rating: '8.8', emoji: '🔫', type: 'Web Series', badge: 'OTT' },
    { id: 8, title: 'Panchayat 4', genre: 'Comedy Drama', rating: '9.0', emoji: '🏘️', type: 'Web Series', badge: 'OTT' },
    { id: 9, title: 'KBC 17', genre: 'Game Show', rating: '7.2', emoji: '💡', type: 'Reality Shows', badge: 'OTT' },
    { id: 10, title: 'Inception 2', genre: 'Sci-Fi', rating: '9.3', emoji: '🌀', type: 'Hollywood', badge: 'Upcoming' },
  ]

  // Filter content based on active filter and search
  const filteredContent = allContent.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className={`explore-container ${theme}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="explore-body">
        <h2 className="explore-title">🎬 Explore</h2>
        <p className="explore-subtitle">Browse Bollywood, Hollywood, OTT and Reality Shows</p>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search movies, shows, web series..."
          className="explore-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter buttons */}
        <div className="filter-row">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="results-count">{filteredContent.length} results found</p>

        {/* Content grid */}
        <div className="explore-grid">
          {filteredContent.map(item => (
            <MovieCard key={item.id} movie={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Explore