// 地圖生成器組件 - 負責生成遊戲地圖的所有邏輯

// 檢查點是否為障礙物
const isObstacle = (x, y, obstaclesList) => {
  return obstaclesList.some(obs => obs.x === x && obs.y === y)
}

// 檢查點是否在網格範圍內
const isValidCell = (x, y, gridSize) => {
  return x >= 0 && x < gridSize && y >= 0 && y < gridSize
}

// 使用 BFS 計算考慮障礙物的最短路徑距離
const calculateShortestPath = (start, end, obstaclesList, gridSize) => {
  if (start.x === end.x && start.y === end.y) return 0
  
  if (isObstacle(end.x, end.y, obstaclesList)) return Infinity
  
  const queue = [{ ...start, distance: 0 }]
  const visited = new Set()
  visited.add(`${start.x}-${start.y}`)
  
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 }
  ]
  
  while (queue.length > 0) {
    const current = queue.shift()
    
    if (current.x === end.x && current.y === end.y) {
      return current.distance
    }
    
    for (const dir of directions) {
      const newX = current.x + dir.dx
      const newY = current.y + dir.dy
      const key = `${newX}-${newY}`
      
      if (isValidCell(newX, newY, gridSize) && 
          !visited.has(key) && 
          !isObstacle(newX, newY, obstaclesList)) {
        visited.add(key)
        queue.push({ x: newX, y: newY, distance: current.distance + 1 })
      }
    }
  }
  
  return Infinity
}

// 生成多個起點
const generateStartPoints = (gridSize, exitCount = null) => {
  const count = exitCount !== null
    ? Math.max(1, Math.min(exitCount, Math.floor(gridSize * gridSize * 0.1)))
    : Math.max(2, Math.min(4, Math.floor(gridSize / 3)))
  const points = []
  const used = new Set()
  
  while (points.length < count) {
    const x = Math.floor(Math.random() * gridSize)
    const y = Math.floor(Math.random() * gridSize)
    const key = `${x}-${y}`
    
    if (!used.has(key)) {
      used.add(key)
      points.push({ x, y })
    }
  }
  
  return points
}

// 障礙物類型列表
const OBSTACLE_TYPES = ['wall', 'air', 'pathway']

// 生成障礙物
const generateObstacles = (startPoints, gridSize, obstaclePercentage = 15) => {
  const count = Math.floor(gridSize * gridSize * (obstaclePercentage / 100))
  const obstacles = []
  const used = new Set(startPoints.map(sp => `${sp.x}-${sp.y}`))
  
  while (obstacles.length < count) {
    const x = Math.floor(Math.random() * gridSize)
    const y = Math.floor(Math.random() * gridSize)
    const key = `${x}-${y}`
    
    if (!used.has(key)) {
      used.add(key)
      // 隨機選擇障礙物類型
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)]
      obstacles.push({ x, y, type })
    }
  }
  
  return obstacles
}

// 計算點到所有起點的最短距離
const calculateDistanceToNearestStart = (point, startPoints, obstacles, gridSize) => {
  return Math.min(
    ...startPoints.map(start => calculateShortestPath(start, point, obstacles, gridSize))
  )
}

// 生成完整的地圖數據
export const generateMap = (gridSize, gameMode = 'random', presetLevel = null, exitCount = null, obstaclePercentage = 15) => {
  const isPreset = gameMode === 'preset' && presetLevel
  const finalGridSize = isPreset ? presetLevel.gridSize : gridSize
  const startPoints = isPreset ? [...presetLevel.startPoints] : generateStartPoints(finalGridSize, exitCount)
  let obstacles = isPreset ? [...presetLevel.obstacles] : generateObstacles(startPoints, finalGridSize, obstaclePercentage)
  
  // 為預設關卡中沒有類型的障礙物添加隨機類型（向後兼容）
  obstacles = obstacles.map(obs => {
    if (!obs.type) {
      obs.type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)]
    }
    return obs
  })

  // 計算所有點到最近起點的最短路徑距離，找出所有最遠的點
  let maxDistance = 0
  const farthestPoints = []
  const allCellDistances = {}
  
  for (let x = 0; x < finalGridSize; x++) {
    for (let y = 0; y < finalGridSize; y++) {
      const key = `${x}-${y}`
      
      if (isObstacle(x, y, obstacles)) {
        allCellDistances[key] = Infinity
        continue
      }
      
      if (startPoints.some(sp => sp.x === x && sp.y === y)) {
        allCellDistances[key] = 0
        continue
      }
      
      const distance = calculateDistanceToNearestStart({ x, y }, startPoints, obstacles, finalGridSize)
      allCellDistances[key] = distance
      
      if (distance !== Infinity) {
        if (distance > maxDistance) {
          maxDistance = distance
          farthestPoints.length = 0
          farthestPoints.push({ x, y })
        } else if (distance === maxDistance) {
          farthestPoints.push({ x, y })
        }
      }
    }
  }
  
  // 如果沒有找到可達點，重新生成（僅在隨機模式下）
  if (farthestPoints.length === 0 && !isPreset) {
    return generateMap(gridSize, gameMode, presetLevel)
  }
  
  return { gridSize: finalGridSize, startPoints, obstacles, farthestPoints, allCellDistances }
}

// 導出工具函數供其他組件使用
export const calculateDistanceToNearestStartForPoint = (point, startPoints, obstacles, gridSize) => {
  return calculateDistanceToNearestStart(point, startPoints, obstacles, gridSize)
}

export const checkIsObstacle = isObstacle

