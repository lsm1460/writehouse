import type { ReactNode } from 'react'
import { CELL_SIZE } from './consts'

interface CellFrameProps {
  lightLevel: number
  isPlayer: boolean
  isTarget: boolean
  children: ReactNode
}

const OPACITY_LEVELS = [0.1, 0.6, 0.75, 0.9, 1.0]
const getOpacity = (level: number) => OPACITY_LEVELS[level] ?? 1.0

export function CellFrame({ lightLevel, isPlayer, isTarget, children }: CellFrameProps) {

  const frameClass = `
    flex items-center justify-center text-base font-bold transition-all duration-150 select-none text-neutral-300 border border-transparent bg-neutral-950
    ${isTarget ? 'bg-green-500 text-black shadow-[inset_0_0_10px_#22c55e] z-10' : ''}
    ${!isTarget && isPlayer ? 'text-green-400 font-black scale-110 z-10' : ''}
  `

  return (
    <span className={frameClass} style={{ opacity: getOpacity(lightLevel), width: CELL_SIZE, height: CELL_SIZE }}>
      {children}
    </span>
  )
}
