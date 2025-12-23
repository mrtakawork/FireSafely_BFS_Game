// 關卡存儲工具函數

const STORAGE_KEY = 'customLevels'

// 獲取所有已保存的關卡
export const getSavedLevels = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('讀取關卡失敗:', error)
    return []
  }
}

// 保存關卡
export const saveLevel = (level) => {
  try {
    const levels = getSavedLevels()
    const levelWithId = {
      ...level,
      id: level.id || Date.now().toString(),
      createdAt: level.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // 如果已存在相同 ID，則更新；否則添加新關卡
    const existingIndex = levels.findIndex(l => l.id === levelWithId.id)
    if (existingIndex >= 0) {
      levels[existingIndex] = levelWithId
    } else {
      levels.push(levelWithId)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(levels))
    return true
  } catch (error) {
    console.error('保存關卡失敗:', error)
    return false
  }
}

// 刪除關卡
export const deleteLevel = (levelId) => {
  try {
    const levels = getSavedLevels()
    const filtered = levels.filter(l => l.id !== levelId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('刪除關卡失敗:', error)
    return false
  }
}

// 導出關卡為 JSON 文件
export const exportLevel = (level) => {
  const dataStr = JSON.stringify(level, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${level.name || 'level'}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 從 JSON 文件導入關卡
export const importLevel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const level = JSON.parse(e.target.result)
        resolve(level)
      } catch (error) {
        reject(new Error('無效的 JSON 文件'))
      }
    }
    reader.onerror = () => reject(new Error('讀取文件失敗'))
    reader.readAsText(file)
  })
}

