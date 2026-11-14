import { useRef } from 'react'

const TiltCard = ({ children, className = '' }) => {
  const cardRef = useRef(null)

  const handleMove = (e) => {
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateY = ((x / rect.width) - 0.5) * 20
    const rotateX = ((y / rect.height) - 0.5) * -20
    card.style.transform =
      `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
  }

  const handleLeave = () => {
    cardRef.current.style.transform =
      'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

export default TiltCard