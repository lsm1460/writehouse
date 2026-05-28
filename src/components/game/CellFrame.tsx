import type { ReactNode } from 'react'
import { CELL_SIZE } from './consts'

interface CellFrameProps {
  lightLevel: number
  isPlayer: boolean
  isTarget: boolean
  children: ReactNode
  isWet: boolean
  isHole: boolean
  isElectrified: boolean
}

const OPACITY_LEVELS = [0.1, 0.6, 0.75, 0.9, 1.0]
const getOpacity = (level: number) => OPACITY_LEVELS[level] ?? 1.0

export function CellFrame({ lightLevel, isPlayer, isTarget, children, isHole, isWet, isElectrified }: CellFrameProps) {
  const frameClass = `
    relative flex items-center justify-center text-base font-bold transition-all duration-150 select-none text-neutral-300 border border-transparent z-0 isolate 
    ${isHole? 'bg-black' : 'bg-neutral-900'}
    ${isTarget ? 'text-black shadow-[inset_0_0_10px_#22c55e] z-10' : ''}
    ${isPlayer ? 'font-black z-10' : ''}
  `
  
  const electricBgColor = isWet ? 'bg-amber-400/40 border-amber-300/60' : 'bg-yellow-500/20 border-yellow-400/40'
  const electricGlow = isWet
    ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
    : 'drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]'
  const electricTextColor = isWet ? 'text-amber-300' : 'text-yellow-400'

  return (
    <span className={frameClass} style={{ opacity: getOpacity(lightLevel), width: CELL_SIZE, height: CELL_SIZE }}>
      {isWet && (
        <>
          <span className="absolute bottom-0.5 left-0 right-0 mx-auto h-[40%] w-[90%] bg-cyan-500/30 border border-cyan-400/50 rounded-full drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] -z-10" />
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 flex items-center justify-center text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.8)] z-20 animate-pulse">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </span>
        </>
      )}

      {isElectrified && (
        <>
          <span
            className={`absolute inset-0 border-2 rounded-sm opacity-80 animate-flash -z-10 ${electricBgColor} ${electricGlow}`}
          />
          <span
            className={`absolute top-0.5 left-0 w-3.5 h-3.5 flex items-center justify-center z-20 animate-bounce ${electricTextColor}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M13 2v9h5l-7 11v-9H6z" />
            </svg>
          </span>
        </>
      )}

      <span className="relative z-10 flex-1 h-full">{children}</span>
    </span>
  )
}
