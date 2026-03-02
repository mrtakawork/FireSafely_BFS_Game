import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getSavedLevels, deleteLevel, importLevel } from '../utils/levelStorage'
import DifficultyStars from '../components/DifficultyStars'

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
    <div className="w-full min-h-screen flex justify-center items-center p-5">
      <div className="bg-white rounded-[20px] p-8 md:p-10 shadow-card w-full max-w-[1000px]">
        <h1 className="text-center text-primary font-bold text-3xl md:text-4xl mb-2.5 drop-shadow-sm">
          最遠點猜測遊戲
        </h1>
        <p className="text-center text-gray-500 text-lg md:text-xl mb-10">
          找出距離 Exit 最遠的格子！
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:gap-8 mb-10">
          {/* 選擇遊戲模式 */}
          <div className="flex flex-col gap-4 rounded-2xl p-6 md:p-8 text-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] border-2 border-transparent hover:border-primary transition-all duration-300">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-gray-800 text-xl md:text-2xl font-bold mb-1">選擇遊戲模式</h2>
            <p className="text-gray-500 text-sm md:text-base mb-0">請選擇下方按鈕開始遊戲</p>
            <button
              type="button"
              onClick={() => {}}
              className="w-full py-4 px-6 rounded-xl text-lg font-semibold text-white bg-gradient-to-br from-gray-500 to-gray-700 border-2 border-transparent shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              經典模式
            </button>
            <button
              type="button"
              onClick={() => navigate('/presetLevels')}
              className="w-full py-4 px-6 rounded-xl text-lg font-semibold text-white bg-gradient-to-br from-primary to-primary-dark border-2 border-transparent shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:border-white/50 transition-all duration-300"
            >
              預設模式
            </button>
          </div>

          {/* 隨機生成 */}
          <div
            onClick={handleRandomMode}
            className="rounded-2xl p-6 md:p-8 text-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] border-2 border-transparent cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary"
          >
            <div className="text-5xl mb-4">🎲</div>
            <h2 className="text-gray-800 text-xl md:text-2xl font-bold mb-3">隨機生成</h2>
            <p className="text-gray-500 text-base leading-relaxed mb-5">
              每次遊戲都會隨機生成 Exit、障礙物和網格大小，挑戰無限可能！
            </p>
            <button className="py-3 px-8 rounded-lg text-white font-semibold text-lg bg-gradient-to-br from-primary to-primary-dark shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
              開始遊戲
            </button>
          </div>

          {/* 自定義關卡 */}
          <div className="rounded-2xl p-6 md:p-8 text-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] border-2 border-transparent cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary">
            <div className="text-5xl mb-4">✏️</div>
            <h2 className="text-gray-800 text-xl md:text-2xl font-bold mb-3">自定義關卡</h2>
            <p className="text-gray-500 text-base leading-relaxed mb-5">
              創建你自己的關卡，設計獨特的挑戰！
            </p>
            <div className="flex flex-col gap-2.5 mt-4">
              <button
                onClick={handleCreateLevel}
                className="w-full py-3 px-6 rounded-lg text-white font-semibold bg-gradient-to-br from-primary to-primary-dark shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
              >
                ➕ 創建關卡
              </button>
              <button
                onClick={handleImportLevel}
                className="w-full py-2.5 px-5 rounded-lg font-semibold text-primary bg-white border-2 border-primary shadow-sm hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
              >
                📥 導入關卡
              </button>
              {customLevels.length > 0 && (
                <button
                  onClick={() => setShowCustomLevels(!showCustomLevels)}
                  className="w-full py-2.5 px-5 rounded-lg font-semibold text-primary bg-white border-2 border-primary shadow-sm hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                >
                  {showCustomLevels ? '隱藏' : '顯示'}已保存關卡 ({customLevels.length})
                </button>
              )}
            </div>
            {showCustomLevels && customLevels.length > 0 && (
              <div className="flex flex-col gap-3 mt-5">
                {customLevels.map((level) => (
                  <div key={level.id} className="flex items-center gap-2.5 flex-wrap md:flex-nowrap">
                    <button
                      onClick={() => handleCustomMode(level)}
                      className="flex-1 min-w-0 py-4 px-5 rounded-lg bg-white border-2 border-primary text-left flex flex-col gap-1 cursor-pointer transition-all duration-200 hover:bg-gradient-to-br hover:from-primary hover:to-primary-dark hover:text-white hover:translate-x-1 hover:shadow-md"
                    >
                      <span className="font-semibold text-base">{level.name}</span>
                      <span className="text-sm opacity-80">
                        {level.gridSize}x{level.gridSize}
                        {typeof level.difficulty === 'number' && (
                          <> · <DifficultyStars difficulty={level.difficulty} /></>
                        )}
                        {level.timeLimit != null ? (
                          <> · 限時 {level.timeLimit}秒</>
                        ) : (
                          <> · 無時間限制</>
                        )}
                      </span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteLevel(level.id, e)}
                      title="刪除關卡"
                      className="py-2 px-3 rounded-md bg-red-400 text-white text-base font-medium shrink-0 hover:bg-red-500 hover:scale-110 transition-all duration-300"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
            {showCustomLevels && customLevels.length === 0 && (
              <p className="text-center text-gray-400 py-5 italic mt-2">還沒有保存的關卡</p>
            )}
          </div>
        </div>

        <div className="bg-amber-100 border-2 border-amber-400 rounded-xl p-6 mt-8">
          <h3 className="text-amber-800 text-xl font-bold mb-4 text-center">遊戲規則</h3>
          <ul className="list-none p-0">
            <li className="text-amber-800 py-2 pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-amber-400 before:font-bold before:text-lg">
              找出距離最近 Exit 最遠的格子
            </li>
            <li className="text-amber-800 py-2 pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-amber-400 before:font-bold before:text-lg">
              黑色格子是障礙物，需要繞過它們
            </li>
            <li className="text-amber-800 py-2 pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-amber-400 before:font-bold before:text-lg">
              每次猜測會顯示該點到最近 Exit 的距離
            </li>
            <li className="text-amber-800 py-2 pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-amber-400 before:font-bold before:text-lg">
              你有 5 次機會找到最遠點
            </li>
            <li className="text-amber-800 py-2 pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-amber-400 before:font-bold before:text-lg">
              找到最遠點即可獲勝並獲得得分
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home
