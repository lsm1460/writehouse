import type { ReactNode } from 'react'
import { CELL_SIZE } from './consts'

interface CellFrameProps {
  lightLevel: number
  isPlayer: boolean
  isTarget: boolean
  children: ReactNode
  isWet: boolean
  isElectrified: boolean
}

const OPACITY_LEVELS = [0.1, 0.6, 0.75, 0.9, 1.0]
const getOpacity = (level: number) => OPACITY_LEVELS[level] ?? 1.0

export function CellFrame({ lightLevel, isPlayer, isTarget, children, isWet, isElectrified }: CellFrameProps) {
  const frameClass = `
    relative flex items-center justify-center text-base font-bold transition-all duration-150 select-none text-neutral-300 border border-transparent bg-neutral-950 z-0 isolate
    ${isTarget ? 'bg-green-500 text-black shadow-[inset_0_0_10px_#22c55e] z-10' : ''}
    ${!isTarget && isPlayer ? 'text-green-400 font-black scale-110 z-10' : ''}
  `

  const electricBgColor = isWet ? 'bg-amber-400/40 border-amber-300/60' : 'bg-yellow-500/20 border-yellow-400/40'
  const electricGlow = isWet ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]'
  const electricTextColor = isWet ? 'text-amber-300' : 'text-yellow-400'

  return (
    <span className={frameClass} style={{ opacity: getOpacity(lightLevel), width: CELL_SIZE, height: CELL_SIZE }}>
      
      {isWet && (
        <>
          <span className="absolute bottom-0.5 left-0 right-0 mx-auto h-[40%] w-[90%] bg-cyan-500/30 border border-cyan-400/50 rounded-full drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] -z-10" />
          <span className="absolute top-0.5 right-0.5 text-[9px] font-black text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.8)] z-20 animate-pulse leading-none">
            🌢
          </span>
        </>
      )}

      {isElectrified && (
        <>
          <span className={`absolute inset-0 border-2 rounded-sm opacity-80 animate-flash -z-10 ${electricBgColor} ${electricGlow}`} />
          <span className={`absolute top-0.5 left-1 text-[10px] font-black z-20 animate-bounce leading-none ${electricTextColor}`}>
            🗲
          </span>
        </>
      )}

      <span className="relative z-10 flex-1 h-full">{children}</span>
    </span>
  )
}