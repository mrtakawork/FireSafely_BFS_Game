import React from 'react'
import './DifficultyStars.css'

// 將數字難度 1–10 轉成 0.5–5 星，並支援半星
function DifficultyStars({ difficulty, className = '' }) {
  if (difficulty == null || typeof difficulty !== 'number') return null

  const stars = Math.max(0.5, Math.min(5, difficulty / 2)) // 1–10 → 0.5–5
  const fullCount = Math.floor(stars)
  const hasHalf = stars % 1 >= 0.5
  const emptyCount = 5 - fullCount - (hasHalf ? 1 : 0)

  return (
    <span className={`difficulty-stars ${className}`} title={`難度 ${difficulty}/10`}>
      {Array.from({ length: fullCount }, (_, i) => (
        <span key={`full-${i}`} className="star star-full">★</span>
      ))}
      {hasHalf && (
        <span className="star star-half">
          <span className="star-half-inner">★</span>
          <span className="star-half-bg">☆</span>
        </span>
      )}
      {Array.from({ length: emptyCount }, (_, i) => (
        <span key={`empty-${i}`} className="star star-empty">☆</span>
      ))}
    </span>
  )
}

export default DifficultyStars
