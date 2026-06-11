import type { TileD } from '~/core/map/tiles/TileD'

interface CellProps {
  char: string
  tile: TileD
}

export function CellD({ char, tile }: CellProps) {
  const isActive = tile.hasEnergy
  
  return (
    <span
      className={`
        text-center select-none duration-3000 font-extrabold
        ${isActive ? 'text-cyan-400 animate-pulse' : 'text-zinc-600 animate-none'}
      `}
      style={{
        filter: isActive
          ? 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))'
          : 'none',
      }}
    >
      {char}
    </span>
  )
}
