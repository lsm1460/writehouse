interface CellProps {
  stageClear: boolean
}

export function CellG({ stageClear }: CellProps) {
  const themeClass = stageClear
    ? 'text-red-500 font-black drop-shadow-[0_0_8px_rgba(239,68,68,0.9)] scale-110 transition-transform duration-500'
    : 'text-neutral-500 font-bold line-through opacity-40 transition-all duration-300'

  return (
    <span className={`relative flex items-center justify-center w-full h-full ${themeClass}`}>
      {stageClear && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-600/15 shadow-[0_0_10px_#ef4444] z-10 animate-pulse pointer-events-none" />
      )}

      {stageClear && (
        <div className="absolute top-1/2 left-1/2 w-0 h-0 z-20 pointer-events-none overflow-visible">
          <span className="absolute w-0.5 h-1.5 rounded-full bg-gradient-to-t from-red-500 to-white animate-spark" />
          <span className="absolute w-0.5 h-1.5 rounded-full bg-gradient-to-t from-red-500 to-white rotate-[60deg] animate-spark" />
          <span className="absolute w-0.5 h-1.5 rounded-full bg-gradient-to-t from-red-500 to-white rotate-[120deg] animate-spark" />
          <span className="absolute w-0.5 h-1.5 rounded-full bg-gradient-to-t from-red-500 to-white rotate-[180deg] animate-spark" />
          <span className="absolute w-0.5 h-1.5 rounded-full bg-gradient-to-t from-red-500 to-white rotate-[240deg] animate-spark" />
          <span className="absolute w-0.5 h-1.5 rounded-full bg-gradient-to-t from-red-500 to-white rotate-[300deg] animate-spark" />
        </div>
      )}

      {/* 기본 ⚑ 아이콘 */}
      <span className="relative z-0 select-none">⚑</span>
    </span>
  )
}
