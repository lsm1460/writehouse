import React from 'react'

interface StageMapPreviewProps {
  grid: string[][]
}

const getTileColor = (char: string): string => {
  switch (char) {
    case '#': return 'bg-neutral-700 border border-neutral-600'
    case 'S': return 'bg-blue-600 text-white font-bold flex items-center justify-center text-[8px]'
    case 'G': return 'bg-green-600 text-white font-bold flex items-center justify-center text-[8px]'
    case 'I': return 'bg-amber-700 border border-amber-600'
    case '_': return 'bg-amber-900/40 border border-dashed border-amber-700'
    case 'g': return 'bg-emerald-900/60 border border-emerald-800'
    case 'w': return 'bg-sky-500/60 border border-sky-400/20'
    case 'W': return 'bg-sky-700 border border-sky-600/30'
    case 'i': return 'bg-purple-800/80 border border-purple-600'
    case 'L': return 'bg-yellow-500 text-neutral-900 font-bold border border-yellow-400'
    case '=': return 'bg-stone-500 border border-stone-400'
    case 'T': return 'bg-green-800 border border-emerald-950'
    case 'H': return 'bg-black border border-neutral-900'
    case 'F': return 'bg-red-600 border border-red-500 animate-pulse'
    case 'f': return 'bg-orange-500 border border-orange-400 animate-pulse'
    default: return 'bg-neutral-950/80 border border-neutral-900/50'
  }
}

const getTileLabel = (char: string): string => {
  switch (char) {
    case 'S': return 'S'
    case 'G': return '⚐'
    case 'L': return 'L'
    case 'T': return 'T'
    default: return ''
  }
}

export const StageMapPreview: React.FC<StageMapPreviewProps> = ({ grid }) => {
  const rowCount = grid.length
  const colCount = grid[0]?.length || 0

  return (
    <div className="flex-1 bg-neutral-950 border border-neutral-900/60 rounded-lg p-6 flex items-center justify-center overflow-hidden">
      <div 
        className="grid gap-[2px] max-w-full max-h-full m-auto"
        style={{
          gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
          aspectRatio: `${colCount} / ${rowCount}`,
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((char, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`w-full aspect-square rounded-[1px] flex items-center justify-center select-none text-[calc(0.3vw+5px)] font-black text-center shrink-0 ${getTileColor(char)}`}
            >
              <span className="scale-[0.8] origin-center block">
                {getTileLabel(char)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}