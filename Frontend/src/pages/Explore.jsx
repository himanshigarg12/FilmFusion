
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import {
  getTrendingMoviesAPI,
  searchMoviesAPI,
  getBollywoodMoviesAPI
} from '../services/api'
import './Explore.css'

const Explore = () => {
  const [activeFilter, setActiveFilter] = useState('Trending')
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  // Only real movie categories
  const filters = ['Trending', 'Bollywood', 'Hollywood']

  // Fetch movies based on filter
  useEffect(() => {
    fetchMovies()
  }, [activeFilter])

  const fetchMovies = async () => {
    setLoading(true)

    try {
      let data

      if (activeFilter === 'Trending') {
        data = await getTrendingMoviesAPI()
      } else if (activeFilter === 'Bollywood') {
        data = await getBollywoodMoviesAPI()
      } else {
        // Hollywood
        data = await getTrendingMoviesAPI()
      }

      if (data.success) {
        setMovies(data.movies)
      }
    } catch (err) {
      console.log('Error fetching movies:', err)
    } finally {
      setLoading(false)
    }
  }

  // Search movies
  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 2) {
      setLoading(true)

      try {
        const data = await searchMoviesAPI(query)

        if (data.success) {
          setMovies(data.movies)
        }
      } catch (err) {
        console.log('Search error:', err)
      } finally {
        setLoading(false)
      }
    } else if (query.length === 0) {
      fetchMovies()
    }
  }

  return (
    <div className="explore-container">

      <Navbar />

      <div className="explore-body">

        <h2 className="explore-title">🎬 Explore</h2>

        <p className="explore-subtitle">
          Browse real movies from TMDB
          <span
            style={{
              color: 'var(--accent)',
              marginLeft: '8px'
            }}
          >
            • Live data
          </span>
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search any movie..."
          className="explore-search"
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* Filters */}
        <div className="filter-row">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-btn ${
                activeFilter === filter ? 'active' : ''
              }`}
              onClick={() => {
                setActiveFilter(filter)
                setSearchQuery('')
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="results-count">
          {loading
            ? 'Loading...'
            : `${movies?.length || 0} results found`}
        </p>

        {/* Movies Grid */}
        {loading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: 'var(--text2)'
            }}
          >
            🎬 Loading movies...
          </div>
        ) : (
          <div className="explore-grid">

            {movies?.map(movie => (
              <div
                key={movie.id}
                className="explore-movie-card"
              >

                {/* Poster */}
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="explore-poster-img"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="explore-poster-placeholder">
                    🎬
                  </div>
                )}

                {/* Movie Information */}
                <div className="explore-movie-info">

                  <div className="explore-movie-title">
                    {movie.title}
                  </div>

                  <div className="explore-movie-meta">

                    <span className="explore-year">
                      {movie.release_date?.split('-')[0] || '2026'}
                    </span>

                    <span className="explore-rating">
                      ⭐ {movie.rating}
                    </span>

                  </div>

                  {movie.overview && (
                    <p className="explore-overview">
                      {movie.overview.substring(0, 60)}...
                    </p>
                  )}

                  <span className="explore-badge">
                    {movie.badge || 'Movie'}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  )
}

export default Explore
