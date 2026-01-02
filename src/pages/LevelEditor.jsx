import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveLevel, exportLevel } from '../utils/levelStorage'
import { generateMap } from '../components/MapGenerator'
import './LevelEditor.css'

function LevelEditor() {
  const navigate = useNavigate()
  const location = useLocation()
  const importedLevel = location.state?.importedLevel

  const [gridSize, setGridSize] = useState(importedLevel?.gridSize || 10)
  const [cellType, setCellType] = useState('exit') // 'exit', 'obstacle', 'door-block', 'empty'
  const [obstacleType, setObstacleType] = useState('wall') // 'wall', 'air', 'pathway'
  const [startPoints, setStartPoints] = useState(importedLevel?.startPoints || [])
  const [obstacles, setObstacles] = useState(importedLevel?.obstacles || [])
  const [doorBlocks, setDoorBlocks] = useState(importedLevel?.doorBlocks || [])
  const [levelName, setLevelName] = useState(importedLevel?.name || '')
  const [previewMode, setPreviewMode] = useState(false)
  const [previewData, setPreviewData] = useState(null)

  // 初始化空網格（僅在沒有導入關卡時）
  useEffect(() => {
    if (!importedLevel) {
      setStartPoints([])
      setObstacles([])
      setDoorBlocks([])
      setLevelName('')
    }
  }, [gridSize, importedLevel])

  // 處理格子點擊
  const handleCellClick = (x, y) => {
    if (previewMode) return

    const isStart = startPoints.some(sp => sp.x === x && sp.y === y)
    const isObstacle = obstacles.some(obs => obs.x === x && obs.y === y)
    const isDoorBlock = doorBlocks.some(db => db.x === x && db.y === y)

    if (cellType === 'exit') {
      // 切換 Exit
      if (isStart) {
        setStartPoints(startPoints.filter(sp => !(sp.x === x && sp.y === y)))
      } else {
        // 移除該位置的其他元素
        setObstacles(obstacles.filter(obs => !(obs.x === x && obs.y === y)))
        setDoorBlocks(doorBlocks.filter(db => !(db.x === x && db.y === y)))
        // 添加 Exit
        setStartPoints([...startPoints, { x, y }])
      }
    } else if (cellType === 'obstacle') {
      // 切換障礙物
      if (isObstacle) {
        setObstacles(obstacles.filter(obs => !(obs.x === x && obs.y === y)))
      } else {
        // 移除該位置的其他元素
        setStartPoints(startPoints.filter(sp => !(sp.x === x && sp.y === y)))
        setDoorBlocks(doorBlocks.filter(db => !(db.x === x && db.y === y)))
        // 添加障礙物
        setObstacles([...obstacles, { x, y, type: obstacleType }])
      }
    } else if (cellType === 'door-block') {
      // 切換 door block
      if (isDoorBlock) {
        setDoorBlocks(doorBlocks.filter(db => !(db.x === x && db.y === y)))
      } else {
        // 移除該位置的其他元素
        setStartPoints(startPoints.filter(sp => !(sp.x === x && sp.y === y)))
        setObstacles(obstacles.filter(obs => !(obs.x === x && obs.y === y)))
        // 添加 door block
        setDoorBlocks([...doorBlocks, { x, y }])
      }
    } else if (cellType === 'empty') {
      // 清除該位置
      setStartPoints(startPoints.filter(sp => !(sp.x === x && sp.y === y)))
      setObstacles(obstacles.filter(obs => !(obs.x === x && obs.y === y)))
      setDoorBlocks(doorBlocks.filter(db => !(db.x === x && db.y === y)))
    }
  }

  // 預覽關卡
  const handlePreview = () => {
    if (startPoints.length === 0) {
      alert('請至少添加一個 Exit！')
      return
    }

    const level = {
      name: levelName || '未命名關卡',
      gridSize,
      startPoints,
      obstacles,
      doorBlocks
    }

    const mapData = generateMap(gridSize, 'preset', level)
    setPreviewData(mapData)
    setPreviewMode(true)
  }

  // 退出預覽
  const handleExitPreview = () => {
    setPreviewMode(false)
    setPreviewData(null)
  }

  // 保存關卡
  const handleSave = () => {
    if (startPoints.length === 0) {
      alert('請至少添加一個 Exit！')
      return
    }

    if (!levelName.trim()) {
      alert('請輸入關卡名稱！')
      return
    }

    const level = {
      name: levelName.trim(),
      gridSize,
      startPoints: [...startPoints],
      obstacles: [...obstacles],
      doorBlocks: [...doorBlocks],
      difficulty: '自定義'
    }

    if (saveLevel(level)) {
      alert('關卡保存成功！')
      navigate('/', { state: { showCustomLevels: true } })
    } else {
      alert('保存失敗，請重試')
    }
  }

  // 導出關卡
  const handleExport = () => {
    if (startPoints.length === 0) {
      alert('請至少添加一個 Exit！')
      return
    }

    const level = {
      name: levelName || '未命名關卡',
      gridSize,
      startPoints: [...startPoints],
      obstacles: [...obstacles],
      doorBlocks: [...doorBlocks],
      difficulty: '自定義'
    }

    exportLevel(level)
  }

  // 清除所有
  const handleClear = () => {
    if (window.confirm('確定要清除所有內容嗎？')) {
      setStartPoints([])
      setObstacles([])
      setDoorBlocks([])
    }
  }

  // 獲取格子類型和內容
  const getCellInfo = (x, y) => {
    const isStart = startPoints.some(sp => sp.x === x && sp.y === y)
    const obstacle = obstacles.find(obs => obs.x === x && obs.y === y)
    const doorBlock = doorBlocks.find(db => db.x === x && db.y === y)
    
    if (isStart) return { type: 'exit', content: 'Exit' }
    if (obstacle) return { type: 'obstacle', subtype: obstacle.type, content: '' }
    if (doorBlock) return { type: 'door-block', content: '🚪' }
    return { type: 'empty', content: '' }
  }

  return (
    <div className="level-editor">
      <div className="editor-container">
        <div className="editor-header">
          <h1>關卡編輯器</h1>
          <button className="btn-back" onClick={() => navigate('/')}>
            返回首頁
          </button>
        </div>

        <div className="editor-content">
          <div className="editor-sidebar">
            <div className="editor-section">
              <h3>網格設置</h3>
              <div className="form-group">
                <label>網格大小:</label>
                <input
                  type="number"
                  min="3"
                  max="30"
                  value={gridSize}
                  onChange={(e) => setGridSize(Math.max(3, Math.min(30, parseInt(e.target.value) || 10)))}
                />
              </div>
            </div>

            <div className="editor-section">
              <h3>關卡信息</h3>
              <div className="form-group">
                <label>關卡名稱:</label>
                <input
                  type="text"
                  placeholder="輸入關卡名稱"
                  value={levelName}
                  onChange={(e) => setLevelName(e.target.value)}
                />
              </div>
            </div>

            <div className="editor-section">
              <h3>編輯工具</h3>
              <div className="tool-buttons">
                <button
                  className={`tool-btn ${cellType === 'exit' ? 'active' : ''}`}
                  onClick={() => setCellType('exit')}
                >
                  🚪 Exit
                </button>
                <button
                  className={`tool-btn ${cellType === 'obstacle' ? 'active' : ''}`}
                  onClick={() => setCellType('obstacle')}
                >
                  🧱 障礙物
                </button>
                <button
                  className={`tool-btn ${cellType === 'door-block' ? 'active' : ''}`}
                  onClick={() => setCellType('door-block')}
                >
                  🚪 門方塊
                </button>
                <button
                  className={`tool-btn ${cellType === 'empty' ? 'active' : ''}`}
                  onClick={() => setCellType('empty')}
                >
                  🗑️ 清除
                </button>
              </div>

              {cellType === 'obstacle' && (
                <div className="obstacle-type-selector">
                  <label>障礙物類型:</label>
                  <div className="type-buttons">
                    <button
                      className={`type-btn ${obstacleType === 'wall' ? 'active' : ''}`}
                      onClick={() => setObstacleType('wall')}
                    >
                      牆壁
                    </button>
                    <button
                      className={`type-btn ${obstacleType === 'air' ? 'active' : ''}`}
                      onClick={() => setObstacleType('air')}
                    >
                      空氣塊
                    </button>
                    <button
                      className={`type-btn ${obstacleType === 'pathway' ? 'active' : ''}`}
                      onClick={() => setObstacleType('pathway')}
                    >
                      通道塊
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="editor-section">
              <h3>統計信息</h3>
              <div className="stats">
                <div>Exit 數量: {startPoints.length}</div>
                <div>障礙物數量: {obstacles.length}</div>
                <div>門方塊數量: {doorBlocks.length}</div>
                <div>網格大小: {gridSize}x{gridSize}</div>
              </div>
            </div>

            <div className="editor-section">
              <h3>操作</h3>
              <div className="action-buttons">
                <button className="btn-preview" onClick={handlePreview}>
                  👁️ 預覽
                </button>
                <button className="btn-save" onClick={handleSave}>
                  💾 保存
                </button>
                <button className="btn-export" onClick={handleExport}>
                  📥 導出 JSON
                </button>
                <button className="btn-clear" onClick={handleClear}>
                  🗑️ 清除
                </button>
              </div>
            </div>
          </div>

          <div className="editor-board">
            {previewMode && previewData ? (
              <div className="preview-mode">
                <div className="preview-header">
                  <h2>預覽模式</h2>
                  <button className="btn-exit-preview" onClick={handleExitPreview}>
                    退出預覽
                  </button>
                </div>
                <div className="preview-info">
                  <p>最遠點數量: {previewData.farthestPoints.length}</p>
                  <p>最大距離: {Math.max(...Object.values(previewData.allCellDistances).filter(d => d !== Infinity))}</p>
                </div>
                <div 
                  className="preview-grid"
                  style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`
                  }}
                >
                  {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                    const x = index % gridSize
                    const y = Math.floor(index / gridSize)
                    const isStart = previewData.startPoints.some(sp => sp.x === x && sp.y === y)
                    const isObstacle = previewData.obstacles.some(obs => obs.x === x && obs.y === y)
                    const obstacle = previewData.obstacles.find(obs => obs.x === x && obs.y === y)
                    const isDoorBlock = previewData.doorBlocks && previewData.doorBlocks.some(db => db.x === x && db.y === y)
                    const isFarthest = previewData.farthestPoints.some(fp => fp.x === x && fp.y === y)
                    const distance = previewData.allCellDistances[`${x}-${y}`]

                    let cellClass = 'preview-cell'
                    if (isStart) cellClass += ' start'
                    else if (isObstacle) {
                      cellClass += ` obstacle obstacle-${obstacle.type}`
                    } else if (isDoorBlock) cellClass += ' door-block'
                    else if (isFarthest) cellClass += ' farthest'
                    else if (distance !== Infinity) cellClass += ' reachable'

                    return (
                      <div key={`${x}-${y}`} className={cellClass}>
                        {isStart && 'Exit'}
                        {isDoorBlock && '🚪'}
                        {isFarthest && '⭐'}
                        {!isStart && !isObstacle && !isDoorBlock && !isFarthest && distance !== Infinity && distance.toFixed(0)}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div 
                className="editor-grid"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gridTemplateRows: `repeat(${gridSize}, 1fr)`
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                  const x = index % gridSize
                  const y = Math.floor(index / gridSize)
                  const cellInfo = getCellInfo(x, y)

                  let cellClass = 'editor-cell'
                  if (cellInfo.type === 'exit') cellClass += ' exit'
                  else if (cellInfo.type === 'obstacle') {
                    cellClass += ` obstacle obstacle-${cellInfo.subtype}`
                  } else if (cellInfo.type === 'door-block') {
                    cellClass += ' door-block'
                  }

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={cellClass}
                      onClick={() => handleCellClick(x, y)}
                      title={`(${x}, ${y})`}
                    >
                      {cellInfo.content}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevelEditor

