// MovieCard.jsx - Reusable movie card component
import './MovieCard.css'

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="movie-poster">{movie.emoji}</div>
      <div className="movie-info">
        <div className="movie-title">{movie.title}</div>
        <div className="movie-meta">
          <span className="movie-genre">{movie.genre}</span>
          <span className="movie-rating">⭐ {movie.rating}</span>
        </div>
        <span className={`badge badge-${movie.badge?.toLowerCase()}`}>
          {movie.badge}
        </span>
      </div>
    </div>
  )
}

export default MovieCard