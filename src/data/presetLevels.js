// 預設關卡數據
export const presetLevels = [
  {
    name: '初級關卡 1',
    difficulty: '簡單',
    gridSize: 8,
    startPoints: [
      { x: 1, y: 1 },
      { x: 6, y: 6 }
    ],
    obstacles: [
      { x: 2, y: 2, type: 'wall' }, { x: 3, y: 2, type: 'wall' }, { x: 4, y: 2, type: 'pathway' },
      { x: 2, y: 5, type: 'air' }, { x: 3, y: 5, type: 'wall' }, { x: 4, y: 5, type: 'pathway' },
      { x: 5, y: 3, type: 'air' }, { x: 5, y: 4, type: 'wall' }
    ]
  },
  {
    name: '初級關卡 2',
    difficulty: '簡單',
    gridSize: 10,
    startPoints: [
      { x: 0, y: 0 },
      { x: 9, y: 9 }
    ],
    obstacles: [
      { x: 1, y: 1, type: 'wall' }, { x: 2, y: 1, type: 'pathway' }, { x: 3, y: 1, type: 'wall' },
      { x: 6, y: 6, type: 'air' }, { x: 7, y: 6, type: 'wall' }, { x: 8, y: 6, type: 'pathway' },
      { x: 4, y: 4, type: 'wall' }, { x: 4, y: 5, type: 'air' }, { x: 5, y: 4, type: 'pathway' },
      { x: 2, y: 7, type: 'wall' }, { x: 3, y: 7, type: 'air' }, { x: 7, y: 2, type: 'pathway' }
    ]
  },
  {
    name: '中級關卡 1',
    difficulty: '中等',
    gridSize: 12,
    startPoints: [
      { x: 2, y: 2 },
      { x: 9, y: 9 },
      { x: 2, y: 9 }
    ],
    obstacles: [
      { x: 4, y: 4, type: 'wall' }, { x: 5, y: 4, type: 'wall' }, { x: 6, y: 4, type: 'pathway' },
      { x: 4, y: 5, type: 'air' }, { x: 6, y: 5, type: 'air' },
      { x: 4, y: 6, type: 'wall' }, { x: 5, y: 6, type: 'pathway' }, { x: 6, y: 6, type: 'wall' },
      { x: 1, y: 5, type: 'wall' }, { x: 1, y: 6, type: 'air' },
      { x: 10, y: 5, type: 'pathway' }, { x: 10, y: 6, type: 'wall' },
      { x: 5, y: 1, type: 'air' }, { x: 6, y: 1, type: 'wall' },
      { x: 5, y: 10, type: 'pathway' }, { x: 6, y: 10, type: 'air' }
    ]
  },
  {
    name: '中級關卡 2',
    difficulty: '中等',
    gridSize: 15,
    startPoints: [
      { x: 1, y: 1 },
      { x: 13, y: 13 },
      { x: 1, y: 13 }
    ],
    obstacles: [
      { x: 3, y: 3, type: 'wall' }, { x: 4, y: 3, type: 'pathway' }, { x: 5, y: 3, type: 'wall' },
      { x: 9, y: 9, type: 'air' }, { x: 10, y: 9, type: 'wall' }, { x: 11, y: 9, type: 'pathway' },
      { x: 3, y: 11, type: 'wall' }, { x: 4, y: 11, type: 'air' }, { x: 5, y: 11, type: 'wall' },
      { x: 7, y: 2, type: 'pathway' }, { x: 7, y: 3, type: 'wall' }, { x: 7, y: 4, type: 'air' },
      { x: 7, y: 11, type: 'wall' }, { x: 7, y: 12, type: 'pathway' }, { x: 7, y: 13, type: 'wall' },
      { x: 2, y: 7, type: 'air' }, { x: 3, y: 7, type: 'wall' }, { x: 4, y: 7, type: 'pathway' },
      { x: 11, y: 7, type: 'wall' }, { x: 12, y: 7, type: 'air' }, { x: 13, y: 7, type: 'pathway' }
    ]
  },
  {
    name: '高級關卡 1',
    difficulty: '困難',
    gridSize: 15,
    startPoints: [
      { x: 0, y: 0 },
      { x: 14, y: 14 },
      { x: 0, y: 14 },
      { x: 14, y: 0 }
    ],
    obstacles: [
      { x: 2, y: 2, type: 'wall' }, { x: 3, y: 2, type: 'wall' }, { x: 4, y: 2, type: 'pathway' },
      { x: 2, y: 3, type: 'air' }, { x: 4, y: 3, type: 'wall' },
      { x: 2, y: 4, type: 'wall' }, { x: 3, y: 4, type: 'pathway' }, { x: 4, y: 4, type: 'air' },
      { x: 10, y: 10, type: 'wall' }, { x: 11, y: 10, type: 'wall' }, { x: 12, y: 10, type: 'pathway' },
      { x: 10, y: 11, type: 'air' }, { x: 12, y: 11, type: 'wall' },
      { x: 10, y: 12, type: 'wall' }, { x: 11, y: 12, type: 'pathway' }, { x: 12, y: 12, type: 'air' },
      { x: 2, y: 10, type: 'wall' }, { x: 3, y: 10, type: 'pathway' }, { x: 4, y: 10, type: 'wall' },
      { x: 2, y: 11, type: 'air' }, { x: 4, y: 11, type: 'wall' },
      { x: 2, y: 12, type: 'wall' }, { x: 3, y: 12, type: 'air' }, { x: 4, y: 12, type: 'pathway' },
      { x: 10, y: 2, type: 'wall' }, { x: 11, y: 2, type: 'pathway' }, { x: 12, y: 2, type: 'wall' },
      { x: 10, y: 3, type: 'air' }, { x: 12, y: 3, type: 'wall' },
      { x: 10, y: 4, type: 'wall' }, { x: 11, y: 4, type: 'air' }, { x: 12, y: 4, type: 'pathway' },
      { x: 7, y: 1, type: 'pathway' }, { x: 7, y: 2, type: 'wall' }, { x: 7, y: 3, type: 'air' },
      { x: 7, y: 12, type: 'wall' }, { x: 7, y: 13, type: 'pathway' }, { x: 7, y: 14, type: 'wall' },
      { x: 1, y: 7, type: 'air' }, { x: 2, y: 7, type: 'wall' }, { x: 3, y: 7, type: 'pathway' },
      { x: 12, y: 7, type: 'wall' }, { x: 13, y: 7, type: 'air' }, { x: 14, y: 7, type: 'pathway' }
    ]
  }
]

