export interface PaletteTile {
  char: string
  label: string
  bg: string
}

export const PALETTE_TILES: PaletteTile[] = [
  { char: ' ', label: '빈 바닥 (Floor)', bg: 'bg-neutral-800 border-neutral-700' },
  { char: '#', label: '벽', bg: 'bg-stone-600 border-stone-500 text-stone-200 font-bold' },
  { char: 'S', label: '시작점 (Start)', bg: 'bg-blue-900 border-blue-700 text-blue-200 font-black' },
  { char: 'G', label: '문', bg: 'bg-green-900 border-green-700 text-green-200 font-black' },
  { char: '_', label: '합성의 토대', bg: 'bg-yellow-900 border-yellow-700 text-yellow-200 font-bold' },
  { char: 'i', label: '빛 수신기', bg: 'bg-amber-800 border-amber-600 text-amber-200' },
  { char: 'I', label: '나무 막대기', bg: 'bg-orange-900 border-orange-700 text-orange-200' },
  { char: 'g', label: '풀', bg: 'bg-emerald-900 border-emerald-700 text-emerald-300' },
  { char: 'T', label: '나무', bg: 'bg-lime-950 border-lime-850 text-lime-400' },
  { char: 'F', label: '맹렬한 불길', bg: 'bg-red-950 border-red-850 text-red-400 font-bold animate-pulse' },
  { char: 'w', label: '얕은 물', bg: 'bg-cyan-950 border-cyan-850 text-cyan-400' },
  { char: 'W', label: '깊은 물', bg: 'bg-cyan-950 border-cyan-850 text-cyan-400' },
  { char: 'E', label: '1차 전지', bg: 'bg-rose-950 border-rose-850 text-rose-300 font-bold' },
  { char: '1', label: '전선', bg: 'bg-purple-950 border-purple-850 text-purple-300 font-bold' },
  { char: '8', label: '지속 가능한 에너지', bg: 'bg-violet-950 border-violet-850 text-violet-300 font-bold' },
  { char: 'O', label: '기름', bg: 'bg-yellow-950 border-yellow-850 text-yellow-500' },
  { char: 'M', label: '좌우', bg: 'bg-red-900 border-red-700 text-red-200 font-bold' },
  { char: 'm', label: '상하', bg: 'bg-red-950 border-red-800 text-red-300' },
  { char: '=', label: '부싯돌', bg: 'bg-amber-950 border-amber-900 text-amber-400' },
  { char: 'L', label: '광원', bg: 'bg-yellow-400 border-yellow-300 text-black font-black' },
  { char: 'H', label: '깊은 구멍', bg: 'bg-neutral-950 border-neutral-800 text-neutral-600 font-bold' },
]
