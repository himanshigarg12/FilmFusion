import './Auth.css'

const AuthLayout = ({ children }) => (
  <div className="auth2">
    <video className="auth2-video" src="/videos/intro.mp4" autoPlay muted loop playsInline />
    <div className="auth2-overlay" />

    <div className="auth2-grid">
      <section className="auth2-left">
        <div className="auth2-logo">🎬 FilmFusion</div>
        <h1>Your entertainment,<br /><span>powered by AI.</span></h1>
        <p className="auth2-lead">
          Discover movies, predict box office results and understand what audiences really feel.
        </p>

        <ul className="auth2-features">
          <li><i>🎯</i><div><b>Mood recommendations</b><small>Cosine similarity + K-Means</small></div></li>
          <li><i>💬</i><div><b>Sentiment analysis</b><small>Logistic Regression, 89% accuracy</small></div></li>
          <li><i>📊</i><div><b>Hit or flop predictor</b><small>Random Forest classifier</small></div></li>
          <li><i>⭐</i><div><b>Follow your stars</b><small>Live data from TMDB</small></div></li>
        </ul>
      </section>

      <section className="auth2-right">{children}</section>
    </div>
  </div>
)

export default AuthLayout