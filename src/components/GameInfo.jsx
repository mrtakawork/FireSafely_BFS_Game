import React from 'react'

const GameInfo = ({
  gameStatus,
  attempts,
  maxAttempts,
  score,
  startPoints,
  farthestPoints,
  onReset,
  gridSize,
  gameMode = 'random',
  timeLimit = null,
  timeRemaining = null
}) => {
  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'waiting':
        return '準備開始遊戲...'
      case 'playing':
        return `猜測中... (${attempts}/${maxAttempts})`
      case 'won':
        return `🎉 恭喜！你找到了最遠點！得分：${score}`
      case 'lost':
        if (timeLimit != null && timeRemaining === 0) {
          return '⏱️ 時間到！遊戲結束'
        }
        const pointsText = farthestPoints && farthestPoints.length > 0
          ? farthestPoints.length === 1
            ? `(${farthestPoints[0].x}, ${farthestPoints[0].y})`
            : `有 ${farthestPoints.length} 個最遠點`
          : ''
        return `😢 遊戲結束！最遠點${pointsText}`
      default:
        return ''
    }
  }

  return (
    <div className="mb-5 relative z-10 pointer-events-auto">
      <div className="rounded-xl p-5 mb-4 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
        <div className="text-lg font-semibold text-gray-800 text-center mb-4 min-h-[30px] flex items-center justify-center">
          {getStatusMessage()}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          {timeLimit != null && (
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-500 font-medium">剩餘時間：</span>
              <span
                className={`text-lg font-bold min-w-[4ch] ${timeRemaining !== null && timeRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-[#667eea]'}`}
              >
                {timeRemaining != null ? `${timeRemaining} 秒` : '—'}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-500 font-medium">嘗試次數：</span>
            <span className="text-lg font-bold text-[#667eea]">{attempts}/{maxAttempts}</span>
          </div>
          {score > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-500 font-medium">得分：</span>
              <span className="text-lg font-bold text-[#667eea]">{score}</span>
            </div>
          )}
          <button
            type="button"
            onClick={onReset}
            className="py-2 px-5 rounded-lg text-white font-semibold text-base bg-gradient-to-br from-[#667eea] to-[#764ba2] border-none shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 relative z-10 pointer-events-auto select-none"
          >
            {gameStatus === 'playing' ? '重新開始' : '新遊戲'}
          </button>
        </div>
      </div>

      {startPoints && startPoints.length > 0 && (
        <div className="rounded-lg p-3 text-center bg-amber-100 border-2 border-amber-400">
          <p className="text-amber-800 text-sm font-medium m-0">
            💡 提示：有 {startPoints.length} 個 Exit {startPoints.map((sp, idx) => `(${sp.x}, ${sp.y})`).join('、')}，請找出距離最近 Exit 最遠的格子！注意：黑色格子是障礙物（牆壁），需要繞過它們。
          </p>
        </div>
      )}
    </div>
  )
}

export default GameInfo
