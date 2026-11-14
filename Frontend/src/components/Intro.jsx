import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import './Intro.css'

const WORDS = ['Discover movies', 'Predict hits & flops', 'Analyse reviews', 'Follow your stars']
const DURATION = 10000

// Number that counts up from 0
const Counter = ({ to, suffix = '', delay = 0 }) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now() + delay
    const tick = (now) => {
      if (now < start) { raf = requestAnimationFrame(tick); return }
      const p = Math.min((now - start) / 1600, 1)
      setValue(Math.floor(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, delay])
  return <>{value.toLocaleString()}{suffix}</>
}

const Intro = ({ onFinish }) => {
  const [leaving, setLeaving] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const doneRef = useRef(false)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setLeaving(true)
    setTimeout(onFinish, 800)
  }, [onFinish])

  // Auto close
  useEffect(() => {
    const t = setTimeout(finish, DURATION)
    return () => clearTimeout(t)
  }, [finish])

  // Keyboard skip
  useEffect(() => {
    const onKey = (e) => {
      if (['Escape', ' ', 'Enter'].includes(e.key)) finish()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finish])

  // Rotating tagline
  useEffect(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % WORDS.length), 1800)
    return () => clearInterval(t)
  }, [])

  // Floating dust particles
  const dust = useMemo(() => (
    Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 6,
    }))
  ), [])

  return (
    <div className={`intro-screen ${leaving ? 'intro-leave' : ''}`}>
      <video className="intro-video" src="/videos/intro.mp4" autoPlay muted loop playsInline />
      <div className="intro-vignette" />

      <div className="intro-dust">
        {dust.map((d, i) => (
          <span key={i} style={{
            left: `${d.left}%`, width: d.size, height: d.size,
            animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s`
          }} />
        ))}
      </div>

      {/* Cinema curtain bars */}
      <div className="intro-bar intro-bar-top" />
      <div className="intro-bar intro-bar-bottom" />

      <div className="intro-content">
        <p className="intro-eyebrow">A N   A I   P O W E R E D   E X P E R I E N C E</p>

        <h1 className="intro-title" aria-label="FilmFusion">
          {'FilmFusion'.split('').map((letter, i) => (
            <span key={i} style={{ animationDelay: `${2 + i * 0.1}s, ${3.4 + i * 0.12}s` }}>
              {letter}
            </span>
          ))}
        </h1>

        <div className="intro-rotator">
          <span key={wordIndex}>{WORDS[wordIndex]}</span>
        </div>

        <div className="intro-stats">
          <div><b><Counter to={89} suffix="%" delay={4200} /></b><small>Sentiment accuracy</small></div>
          <div><b><Counter to={3} delay={4400} /></b><small>AI models</small></div>
          <div><b><Counter to={50000} suffix="+" delay={4600} /></b><small>Reviews trained on</small></div>
        </div>

        <button className="intro-enter" onClick={finish}>Enter FilmFusion ▶</button>
      </div>

      <button className="intro-skip" onClick={finish}>
        Skip <span>▸▸</span>
      </button>
      <p className="intro-hint">Press Esc or Space to skip</p>
      <div className="intro-progress"><div style={{ animationDuration: `${DURATION}ms` }} /></div>
    </div>
  )
}

export default Intro