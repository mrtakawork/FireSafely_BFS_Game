import React from 'react'
import { useNavigate } from 'react-router-dom'
import { presetLevels } from '../data/presetLevels'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  const handleRandomMode = () => {
    navigate('/game', { state: { mode: 'random' } })
  }

  const handlePresetMode = (level) => {
    navigate('/game', { state: { mode: 'preset', level } })
  }

  return (
    <div className="home">
      <div className="home-container">
        <h1 className="home-title">最遠點猜測遊戲</h1>
        <p className="home-subtitle">找出距離 door 最遠的格子！</p>

        <div className="mode-selection">
          <div className="mode-card" onClick={handleRandomMode}>
            <div className="mode-icon">🎲</div>
            <h2 className="mode-title">隨機生成</h2>
            <p className="mode-description">
              每次遊戲都會隨機生成 door、障礙物和網格大小，挑戰無限可能！
            </p>
            <button className="mode-button">開始遊戲</button>
          </div>

          <div className="mode-card">
            <div className="mode-icon">📋</div>
            <h2 className="mode-title">預設關卡</h2>
            <p className="mode-description">
              選擇精心設計的關卡，挑戰不同難度的謎題！
            </p>
            <div className="preset-levels">
              {presetLevels.map((level, index) => (
                <button
                  key={index}
                  className="level-button"
                  onClick={() => handlePresetMode(level)}
                >
                  <span className="level-name">{level.name}</span>
                  <span className="level-details">
                    {level.gridSize}x{level.gridSize} · {level.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="game-rules">
          <h3>遊戲規則</h3>
          <ul>
            <li>找出距離最近 door 最遠的格子</li>
            <li>黑色格子是障礙物，需要繞過它們</li>
            <li>每次猜測會顯示該點到最近 door 的距離</li>
            <li>你有 5 次機會找到最遠點</li>
            <li>找到最遠點即可獲勝並獲得得分</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home

