import React, { useState } from 'react'
import './GameConfig.css'

const GameConfig = ({
  gridSize,
  doorCount,
  obstaclePercentage,
  maxAttempts,
  onConfigChange,
  gameMode,
  gameStatus
}) => {
  const [localGridSize, setLocalGridSize] = useState(gridSize)
  const [localDoorCount, setLocalDoorCount] = useState(doorCount)
  const [localObstaclePercentage, setLocalObstaclePercentage] = useState(obstaclePercentage)
  const [localMaxAttempts, setLocalMaxAttempts] = useState(maxAttempts)

  const handleApply = () => {
    onConfigChange({
      gridSize: localGridSize,
      doorCount: localDoorCount,
      obstaclePercentage: localObstaclePercentage,
      maxAttempts: localMaxAttempts
    })
  }

  const handleReset = () => {
    setLocalGridSize(10)
    setLocalDoorCount(null)
    setLocalObstaclePercentage(15)
    setLocalMaxAttempts(5)
    onConfigChange({
      gridSize: 10,
      doorCount: null,
      obstaclePercentage: 15,
      maxAttempts: 5
    })
  }

  // const isDisabled = gameStatus === 'playing' || gameMode === 'preset'
  const isDisabled = gameStatus === 'playing'

  return (
    <div className="game-config">
      <h3 className="config-title">遊戲配置</h3>
      
      <div className="config-group">
        <label htmlFor="config-grid-size">
          網格大小：
          <span className="config-value">{localGridSize}x{localGridSize}</span>
        </label>
        <input
          type="range"
          id="config-grid-size"
          min="5"
          max="30"
          value={localGridSize}
          onChange={(e) => setLocalGridSize(Number(e.target.value))}
          disabled={isDisabled}
          className="config-slider"
        />
        <div className="config-presets">
          {[5, 8, 10, 12, 15, 20, 25, 30].map(size => (
            <button
              key={size}
              className={`config-preset-btn ${localGridSize === size ? 'active' : ''}`}
              onClick={() => setLocalGridSize(size)}
              disabled={isDisabled}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="config-group">
        <label htmlFor="config-door-count">
          Door 數量：
          <span className="config-value">
            {localDoorCount === null ? '自動' : localDoorCount}
          </span>
        </label>
        <div className="config-radio-group">
          <label>
            <input
              type="radio"
              name="door-count"
              checked={localDoorCount === null}
              onChange={() => setLocalDoorCount(null)}
              disabled={isDisabled}
            />
            自動 (2-4個)
          </label>
          {[1, 2, 3, 4, 5, 6].map(count => (
            <label key={count}>
              <input
                type="radio"
                name="door-count"
                checked={localDoorCount === count}
                onChange={() => setLocalDoorCount(count)}
                disabled={isDisabled}
              />
              {count} 個
            </label>
          ))}
        </div>
      </div>

      <div className="config-group">
        <label htmlFor="config-obstacle">
          障礙物比例：
          <span className="config-value">{localObstaclePercentage}%</span>
        </label>
        <input
          type="range"
          id="config-obstacle"
          min="0"
          max="30"
          step="5"
          value={localObstaclePercentage}
          onChange={(e) => setLocalObstaclePercentage(Number(e.target.value))}
          disabled={isDisabled}
          className="config-slider"
        />
        <div className="config-presets">
          {[0, 5, 10, 15, 20, 25, 30].map(percent => (
            <button
              key={percent}
              className={`config-preset-btn ${localObstaclePercentage === percent ? 'active' : ''}`}
              onClick={() => setLocalObstaclePercentage(percent)}
              disabled={isDisabled}
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>

      <div className="config-group">
        <label htmlFor="config-attempts">
          最大嘗試次數：
          <span className="config-value">{localMaxAttempts} 次</span>
        </label>
        <input
          type="range"
          id="config-attempts"
          min="3"
          max="10"
          value={localMaxAttempts}
          onChange={(e) => setLocalMaxAttempts(Number(e.target.value))}
          disabled={isDisabled}
          className="config-slider"
        />
        <div className="config-presets">
          {[3, 4, 5, 6, 7, 8, 9, 10].map(attempts => (
            <button
              key={attempts}
              className={`config-preset-btn ${localMaxAttempts === attempts ? 'active' : ''}`}
              onClick={() => setLocalMaxAttempts(attempts)}
              disabled={isDisabled}
            >
              {attempts}
            </button>
          ))}
        </div>
      </div>

      <div className="config-actions">
        <button
          className="config-apply-btn"
          onClick={handleApply}
          disabled={isDisabled}
        >
          應用配置
        </button>
        <button
          className="config-reset-btn"
          onClick={handleReset}
          disabled={isDisabled}
        >
          重置為默認
        </button>
      </div>
    </div>
  )
}

export default GameConfig


