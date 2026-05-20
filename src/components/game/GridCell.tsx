import { useGame } from '~/context/GameContext'
import { Tile } from '~/core/map/Tile'

interface GridCellProps {
  tile: Tile
  isPlayer: boolean
  isTarget: boolean
}

export function GridCell({ tile, isPlayer, isTarget }: GridCellProps) {
  const { ctx } = useGame()
  const lightLevel = ctx.fog.getLightLevel(tile.x, tile.y)
  const lightState = ctx.fog.getLightState(tile.x, tile.y)
  const isGateOpened = tile.char === 'G' && lightState.environmentIntensity > 0

  const getTileTheme = () => {
    switch (tile.char) {
      case 'L':
        return 'text-yellow-400 font-black animate-pulse'
      case 'G':
        return isGateOpened ? 'text-emerald-400 font-black' : 'text-neutral-500 font-bold line-through opacitiy-80'
      default:
        return 'text-neutral-300 font-normal' // 일반 바닥
    }
  }

  const opacityMap = [0.0, 0.25, 0.55, 0.85, 1.0]
  const opacityValue = opacityMap[lightLevel] ?? 0.0
  const isLightSource = tile.char === 'L' && lightLevel > 0
  const textShadowStyle = isLightSource ? '0 0 4px #facc15, 0 0 12px #eab308, 0 0 20px rgba(234,179,8,0.4)' : undefined

  const cellClass = `
    w-14 h-14 flex items-center justify-center text-[32px] font-bold font-mono transition-all duration-150 select-none border border-transparent
    ${lightLevel === 0 ? 'bg-black text-transparent' : 'bg-neutral-950'}
    ${getTileTheme()}
    ${lightLevel > 0 && isTarget ? 'bg-green-500 text-black shadow-[inset_0_0_10px_#22c55e] z-10' : ''}
    ${lightLevel > 0 && !isTarget && isPlayer ? 'text-green-400 font-black scale-110 z-10' : ''}
  `

  return (
    <span
      className={cellClass}
      style={{
        opacity: opacityValue,
        textShadow: textShadowStyle,
      }}
    >
      {lightLevel === 0 ? ' ' : isPlayer ? '@' : tile.char}
    </span>
  )
}
