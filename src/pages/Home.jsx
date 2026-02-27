import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { presetLevels } from '../data/presetLevels'
import { getSavedLevels, deleteLevel, importLevel } from '../utils/levelStorage'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [customLevels, setCustomLevels] = useState([])
  const [showCustomLevels, setShowCustomLevels] = useState(location.state?.showCustomLevels || false)

  useEffect(() => {
    setCustomLevels(getSavedLevels())
  }, [])

  const handleRandomMode = () => {
    navigate('/game', { state: { mode: 'random' } })
  }

  const handlePresetMode = (level) => {
    navigate('/game', { state: { mode: 'preset', level } })
  }

  const handleCustomMode = (level) => {
    navigate('/game', { state: { mode: 'preset', level } })
  }

  const handleCreateLevel = () => {
    navigate('/editor')
  }

  const handleDeleteLevel = (levelId, e) => {
    e.stopPropagation()
    if (window.confirm('確定要刪除這個關卡嗎？')) {
      if (deleteLevel(levelId)) {
        setCustomLevels(getSavedLevels())
      }
    }
  }

  const handleImportLevel = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (file) {
        try {
          const level = await importLevel(file)
          // 驗證關卡數據
          if (level.gridSize && level.startPoints && level.obstacles) {
            navigate('/editor', { state: { importedLevel: level } })
          } else {
            alert('無效的關卡文件格式')
          }
        } catch (error) {
          alert(error.message || '導入失敗')
        }
      }
    }
    input.click()
  }

  return (
    <div className="home">
      <div className="home-container">
        <h1 className="home-title">最遠點猜測遊戲</h1>
        <p className="home-subtitle">找出距離 Exit 最遠的格子！</p>

        <div className="mode-selection">

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

          <div className="mode-card" onClick={handleRandomMode}>
            <div className="mode-icon">🎲</div>
            <h2 className="mode-title">隨機生成</h2>
            <p className="mode-description">
              每次遊戲都會隨機生成 Exit、障礙物和網格大小，挑戰無限可能！
            </p>
            <button className="mode-button">開始遊戲</button>
          </div>

          <div className="mode-card">
            <div className="mode-icon">✏️</div>
            <h2 className="mode-title">自定義關卡</h2>
            <p className="mode-description">
              創建你自己的關卡，設計獨特的挑戰！
            </p>
            <div className="custom-levels-actions">
              <button className="mode-button" onClick={handleCreateLevel}>
                ➕ 創建關卡
              </button>
              <button className="mode-button-secondary" onClick={handleImportLevel}>
                📥 導入關卡
              </button>
              {customLevels.length > 0 && (
                <button 
                  className="mode-button-secondary" 
                  onClick={() => setShowCustomLevels(!showCustomLevels)}
                >
                  {showCustomLevels ? '隱藏' : '顯示'}已保存關卡 ({customLevels.length})
                </button>
              )}
            </div>
            {showCustomLevels && customLevels.length > 0 && (
              <div className="preset-levels">
                {customLevels.map((level) => (
                  <div key={level.id} className="level-button-wrapper">
                    <button
                      className="level-button"
                      onClick={() => handleCustomMode(level)}
                    >
                      <span className="level-name">{level.name}</span>
                      <span className="level-details">
                        {level.gridSize}x{level.gridSize} · {level.difficulty || '自定義'}
                      </span>
                    </button>
                    <button
                      className="level-delete-btn"
                      onClick={(e) => handleDeleteLevel(level.id, e)}
                      title="刪除關卡"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
            {showCustomLevels && customLevels.length === 0 && (
              <p className="no-custom-levels">還沒有保存的關卡</p>
            )}
          </div>
        </div>

        <div className="game-rules">
          <h3>遊戲規則</h3>
          <ul>
            <li>找出距離最近 Exit 最遠的格子</li>
            <li>黑色格子是障礙物，需要繞過它們</li>
            <li>每次猜測會顯示該點到最近 Exit 的距離</li>
            <li>你有 5 次機會找到最遠點</li>
            <li>找到最遠點即可獲勝並獲得得分</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home

