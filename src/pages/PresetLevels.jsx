import React from 'react'
import { useNavigate } from 'react-router-dom'
import { presetLevels } from '../data/loadPresetLevels'
import DifficultyStars from '../components/DifficultyStars'

function PresetLevels() {
  const navigate = useNavigate()

  const handleSelectLevel = (level) => {
    navigate('/game', { state: { mode: 'preset', level } })
  }

  return (
    <div className="w-full min-h-screen p-5 flex justify-center items-start">
      <div className="bg-white rounded-[20px] p-8 md:p-10 shadow-card w-full max-w-[600px]">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="mb-5 py-2.5 px-5 rounded-lg bg-gray-100 text-primary border-2 border-primary font-semibold text-base cursor-pointer transition-all duration-300 hover:bg-primary hover:text-white"
          >
            返回首頁
          </button>
          <h1 className="text-gray-800 text-xl md:text-2xl font-bold mb-2">預設關卡</h1>
          <p className="text-gray-500 text-base leading-relaxed">
            選擇精心設計的關卡，挑戰不同難度的謎題！
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {presetLevels.map((level, index) => (
            <button
              key={index}
              onClick={() => handleSelectLevel(level)}
              className="w-full py-4 px-5 rounded-lg bg-white border-2 border-primary flex flex-col items-start text-left cursor-pointer transition-all duration-200 hover:bg-gradient-to-br hover:from-primary hover:to-primary-dark hover:text-white hover:translate-x-1 hover:shadow-md"
            >
              <span className="font-semibold text-base mb-1">{level.name}</span>
              <span className="text-sm opacity-80">
                {level.gridSize}x{level.gridSize}
                {typeof level.difficulty === 'number' ? (
                  <> · <DifficultyStars difficulty={level.difficulty} /></>
                ) : (
                  level.difficulty != null && <> · {level.difficulty}</>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PresetLevels
