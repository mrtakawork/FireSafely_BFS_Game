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
  const [cellType, setCellType] = useState('exit') // 'exit', 'obstacle', 'door-block', 'empty', 'eraser'
  const [isDrawing, setIsDrawing] = useState(false)
  const [obstacleType, setObstacleType] = useState('wall') // 'wall', 'air', 'pathway'
  const [startPoints, setStartPoints] = useState(importedLevel?.startPoints || [])
  const [obstacles, setObstacles] = useState(importedLevel?.obstacles || [])
  const [doorBlocks, setDoorBlocks] = useState(importedLevel?.doorBlocks || [])
  const [levelName, setLevelName] = useState(importedLevel?.name || '')
  const [difficulty, setDifficulty] = useState(() => {
    const d = importedLevel?.difficulty
    return typeof d === 'number' && d >= 1 && d <= 10 ? d : 5
  })
  const [timeLimit, setTimeLimit] = useState(() => {
    const t = importedLevel?.timeLimit
    return t != null && typeof t === 'number' && t >= 0 ? t : null
  })
  const [timeLimitInput, setTimeLimitInput] = useState(() => {
    const t = importedLevel?.timeLimit
    return t != null && typeof t === 'number' && t >= 0 ? String(t) : ''
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [previewData, setPreviewData] = useState(null)

  // 判斷指定障礙物清單中的牆壁
  const isWallObstacle = (x, y, obstacleList = obstacles) => {
    if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) return false
    const obstacle = obstacleList.find(obs => obs.x === x && obs.y === y)
    return obstacle?.type === 'wall'
  }

  // 依據相鄰牆壁決定門方向（左右牆 = 垂直門；上下牆 = 水平門）
  const getDoorDirectionClass = (x, y, obstacleList = obstacles) => {
    const hasTopWall = isWallObstacle(x, y - 1, obstacleList)
    const hasBottomWall = isWallObstacle(x, y + 1, obstacleList)
    const hasLeftWall = isWallObstacle(x - 1, y, obstacleList)
    const hasRightWall = isWallObstacle(x + 1, y, obstacleList)

    if (hasLeftWall && hasRightWall) return 'door-vertical'
    if (hasTopWall && hasBottomWall) return 'door-horizontal'
    return 'door-horizontal'
  }

  // 初始化空網格（僅在沒有導入關卡時）
  useEffect(() => {
    if (!importedLevel) {
      setStartPoints([])
      setObstacles([])
      setDoorBlocks([])
      setLevelName('')
    } else {
      const d = importedLevel.difficulty
      setDifficulty(typeof d === 'number' && d >= 1 && d <= 10 ? d : 5)
      const t = importedLevel.timeLimit
      if (t != null && typeof t === 'number' && t >= 0) {
        setTimeLimit(t)
        setTimeLimitInput(String(t))
      } else {
        setTimeLimit(null)
        setTimeLimitInput('')
      }
    }
  }, [gridSize, importedLevel])

  // 套用工具到指定格子（供點擊與拖曳使用）
  // isDragging: 拖曳時為 true，只做「塗上」或「擦除」，不做切換
  const applyToolToCell = (x, y, isDragging = false) => {
    if (previewMode) return

    const tool = cellType === 'eraser' ? 'empty' : cellType
    const currentObstacleType = obstacleType

    const clearCell = () => {
      setStartPoints(prev => prev.filter(sp => !(sp.x === x && sp.y === y)))
      setObstacles(prev => prev.filter(obs => !(obs.x === x && obs.y === y)))
      setDoorBlocks(prev => prev.filter(db => !(db.x === x && db.y === y)))
    }

    if (tool === 'exit') {
      setStartPoints(prev => {
        const isStart = prev.some(sp => sp.x === x && sp.y === y)
        if (isStart && !isDragging) return prev.filter(sp => !(sp.x === x && sp.y === y))
        if (isStart && isDragging) return prev
        return [...prev.filter(sp => !(sp.x === x && sp.y === y)), { x, y }]
      })
      setObstacles(prev => prev.filter(obs => !(obs.x === x && obs.y === y)))
      setDoorBlocks(prev => prev.filter(db => !(db.x === x && db.y === y)))
    } else if (tool === 'obstacle') {
      setObstacles(prev => {
        const isObstacle = prev.some(obs => obs.x === x && obs.y === y)
        if (isObstacle && !isDragging) return prev.filter(obs => !(obs.x === x && obs.y === y))
        if (isObstacle && isDragging) return prev
        return [...prev.filter(obs => !(obs.x === x && obs.y === y)), { x, y, type: currentObstacleType }]
      })
      setStartPoints(prev => prev.filter(sp => !(sp.x === x && sp.y === y)))
      setDoorBlocks(prev => prev.filter(db => !(db.x === x && db.y === y)))
    } else if (tool === 'door-block') {
      setDoorBlocks(prev => {
        const isDoorBlock = prev.some(db => db.x === x && db.y === y)
        if (isDoorBlock && !isDragging) return prev.filter(db => !(db.x === x && db.y === y))
        if (isDoorBlock && isDragging) return prev
        return [...prev.filter(db => !(db.x === x && db.y === y)), { x, y }]
      })
      setStartPoints(prev => prev.filter(sp => !(sp.x === x && sp.y === y)))
      setObstacles(prev => prev.filter(obs => !(obs.x === x && obs.y === y)))
    } else if (tool === 'empty') {
      clearCell()
    }
  }

  // 拖曳繪製：滑鼠按下開始（單擊或拖曳的第一格）
  const handleCellMouseDown = (x, y) => {
    if (previewMode) return
    setIsDrawing(true)
    applyToolToCell(x, y, false)
  }

  // 拖曳繪製：滑鼠移入格子時（像筆一樣連續塗上）
  const handleCellMouseEnter = (x, y) => {
    if (previewMode || !isDrawing) return
    applyToolToCell(x, y, true)
  }

  // 全域滑鼠放開時結束拖曳
  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false)
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  // 預覽關卡
  const handlePreview = () => {
    if (startPoints.length === 0) {
      alert('請至少添加一個 Exit！')
      return
    }

    const level = {
      name: levelName || '未命名關卡',
      gridSize,
      difficulty,
      timeLimit,
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
      difficulty,
      timeLimit,
      startPoints: [...startPoints],
      obstacles: [...obstacles],
      doorBlocks: [...doorBlocks]
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
      difficulty,
      timeLimit,
      startPoints: [...startPoints],
      obstacles: [...obstacles],
      doorBlocks: [...doorBlocks]
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
    if (doorBlock) return { type: 'door-block', content: '' }
    return { type: 'empty', content: '' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5 pb-[120px]">
      <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white">
          <h1 className="m-0 text-2xl font-bold">關卡編輯器</h1>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="py-2.5 px-5 rounded-lg bg-white/20 border-2 border-white text-white font-medium cursor-pointer text-base transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5"
          >
            返回首頁
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 p-5">
          <div className="w-full lg:w-[300px] flex flex-col gap-5">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="m-0 mb-4 text-gray-800 text-lg font-semibold">網格設置</h3>
              <div className="mb-4">
                <label className="block mb-1 text-gray-600 font-medium">網格大小:</label>
                <input
                  type="number"
                  min="3"
                  max="30"
                  value={gridSize}
                  onChange={(e) => setGridSize(Math.max(3, Math.min(30, parseInt(e.target.value) || 10)))}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-base focus:outline-none focus:border-[#667eea] transition-colors"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="m-0 mb-4 text-gray-800 text-lg font-semibold">關卡信息</h3>
              <div className="mb-4">
                <label className="block mb-1 text-gray-600 font-medium">關卡名稱:</label>
                <input
                  type="text"
                  placeholder="輸入關卡名稱"
                  value={levelName}
                  onChange={(e) => setLevelName(e.target.value)}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-base focus:outline-none focus:border-[#667eea] transition-colors"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-600 font-medium">難度 (1-10):</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={difficulty}
                  onChange={(e) => setDifficulty(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-base focus:outline-none focus:border-[#667eea] transition-colors"
                />
              </div>
              <div className="mb-0">
                <label className="block mb-1 text-gray-600 font-medium">時間限制 (秒):</label>
                <input
                  type="number"
                  min={1}
                  placeholder="留空 = 無時間限制"
                  value={timeLimitInput}
                  onChange={(e) => {
                    const raw = e.target.value.trim()
                    setTimeLimitInput(raw)
                    const n = raw === '' ? null : parseInt(raw, 10)
                    setTimeLimit(n != null && !isNaN(n) && n >= 1 ? n : null)
                  }}
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-md text-base focus:outline-none focus:border-[#667eea] transition-colors"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h3 className="m-0 mb-4 text-gray-800 text-lg font-semibold">統計信息</h3>
              <div className="flex flex-col gap-2 text-gray-600">
                <div className="py-2 px-3 bg-white rounded-md border border-gray-200">Exit 數量: {startPoints.length}</div>
                <div className="py-2 px-3 bg-white rounded-md border border-gray-200">障礙物數量: {obstacles.length}</div>
                <div className="py-2 px-3 bg-white rounded-md border border-gray-200">門方塊數量: {doorBlocks.length}</div>
                <div className="py-2 px-3 bg-white rounded-md border border-gray-200">網格大小: {gridSize}x{gridSize}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4 py-4 px-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="m-0 text-gray-800 text-base font-semibold whitespace-nowrap">操作</h3>
              <div className="flex flex-wrap gap-2.5">
                <button type="button" onClick={handlePreview} className="py-3 px-4 rounded-lg border-none cursor-pointer text-base font-semibold text-white bg-gradient-to-br from-[#84fab0] to-[#8fd3f4] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                  👁️ 預覽
                </button>
                <button type="button" onClick={handleSave} className="py-3 px-4 rounded-lg border-none cursor-pointer text-base font-semibold text-white bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                  💾 保存
                </button>
                <button type="button" onClick={handleExport} className="py-3 px-4 rounded-lg border-none cursor-pointer text-base font-semibold text-white bg-gradient-to-br from-[#f093fb] to-[#f5576c] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                  📥 導出 JSON
                </button>
                <button type="button" onClick={handleClear} className="py-3 px-4 rounded-lg border-none cursor-pointer text-base font-semibold text-white bg-red-400 hover:bg-red-500 hover:-translate-y-0.5 transition-all duration-300">
                  🗑️ 清除
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-start p-5 bg-gray-50 rounded-lg overflow-auto">
            {previewMode && previewData ? (
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="m-0 text-gray-800">預覽模式</h2>
                  <button type="button" onClick={handleExitPreview} className="py-2 px-4 rounded-md bg-red-400 text-white border-none cursor-pointer text-sm font-medium hover:bg-red-500 hover:-translate-y-0.5 transition-all duration-300">
                    退出預覽
                  </button>
                </div>
                <div className="mb-4 p-2.5 bg-white rounded-md border border-gray-200">
                  <p className="my-1 text-gray-600">最遠點數量: {previewData.farthestPoints.length}</p>
                  <p className="my-1 text-gray-600">最大距離: {Math.max(...Object.values(previewData.allCellDistances).filter(d => d !== Infinity))}</p>
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
                    } else if (isDoorBlock) {
                      cellClass += ` door-block ${getDoorDirectionClass(x, y, previewData.obstacles)}`
                    }
                    else if (isFarthest) cellClass += ' farthest'
                    else if (distance !== Infinity) cellClass += ' reachable'

                    return (
                      <div key={`${x}-${y}`} className={cellClass}>
                        {isStart && <img src={`${import.meta.env.BASE_URL}exit_sign.png`} alt="Exit" className="editor-exit-sign" />}
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
                    cellClass += ` door-block ${getDoorDirectionClass(x, y)}`
                  }

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={cellClass}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleCellMouseDown(x, y)
                      }}
                      onMouseEnter={() => handleCellMouseEnter(x, y)}
                      title={`(${x}, ${y})`}
                    >
                      {cellInfo.type === 'exit' ? (
                        <img src={`${import.meta.env.BASE_URL}exit_sign.png`} alt="Exit" className="editor-exit-sign" />
                      ) : (
                        cellInfo.content
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* 浮動底部工具列 */}
      {!previewMode && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-2xl shadow-xl py-4 px-6 border-2 border-[#667eea]/30">
          <div className="flex flex-wrap items-center gap-5">
            <h3 className="m-0 text-lg text-gray-800 font-semibold">編輯工具</h3>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                className={`py-2.5 px-4 rounded-lg border-2 text-base font-medium cursor-pointer transition-all duration-300 ${cellType === 'exit' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-[#764ba2]' : 'bg-white border-gray-200 hover:border-[#667eea] hover:-translate-y-0.5'}`}
                onClick={() => setCellType('exit')}
              >
                🚪 Exit
              </button>
              <button
                type="button"
                className={`py-2.5 px-4 rounded-lg border-2 text-base font-medium cursor-pointer transition-all duration-300 ${cellType === 'obstacle' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-[#764ba2]' : 'bg-white border-gray-200 hover:border-[#667eea] hover:-translate-y-0.5'}`}
                onClick={() => setCellType('obstacle')}
              >
                🧱 障礙物
              </button>
              <button
                type="button"
                className={`py-2.5 px-4 rounded-lg border-2 text-base font-medium cursor-pointer transition-all duration-300 ${cellType === 'door-block' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-[#764ba2]' : 'bg-white border-gray-200 hover:border-[#667eea] hover:-translate-y-0.5'}`}
                onClick={() => setCellType('door-block')}
              >
                🚪 門方塊
              </button>
              <button
                type="button"
                className={`py-2.5 px-4 rounded-lg border-2 text-base font-medium cursor-pointer transition-all duration-300 ${cellType === 'empty' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-[#764ba2]' : 'bg-white border-gray-200 hover:border-[#667eea] hover:-translate-y-0.5'}`}
                onClick={() => setCellType('empty')}
              >
                🧽 橡皮擦
              </button>
            </div>
            {cellType === 'obstacle' && (
              <div className="flex items-center gap-2.5 pl-4 border-l-2 border-gray-200">
                <span className="text-gray-600 font-medium text-sm">障礙物類型:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`py-2 px-3.5 rounded-md text-sm border-2 cursor-pointer transition-all ${obstacleType === 'wall' ? 'bg-[#667eea] text-white border-[#667eea]' : 'bg-white border-gray-200 text-gray-700 hover:border-[#667eea]'}`}
                    onClick={() => setObstacleType('wall')}
                  >
                    牆壁
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-3.5 rounded-md text-sm border-2 cursor-pointer transition-all ${obstacleType === 'air' ? 'bg-[#667eea] text-white border-[#667eea]' : 'bg-white border-gray-200 text-gray-700 hover:border-[#667eea]'}`}
                    onClick={() => setObstacleType('air')}
                  >
                    空氣塊
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-3.5 rounded-md text-sm border-2 cursor-pointer transition-all ${obstacleType === 'pathway' ? 'bg-[#667eea] text-white border-[#667eea]' : 'bg-white border-gray-200 text-gray-700 hover:border-[#667eea]'}`}
                    onClick={() => setObstacleType('pathway')}
                  >
                    通道塊
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LevelEditor

