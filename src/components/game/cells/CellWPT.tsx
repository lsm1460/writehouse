import type { TileWPT } from '~/core/map/tiles/TileWPT'

interface CellProps {
  char: string
  tile: TileWPT
}

export function CellWPT({ char, tile }: CellProps) {
  const isActive = tile.hasEnergy

  return (
    <span
      className={`
        relative inline-block text-center select-none font-extrabold transition-all duration-500
        rotate-[15deg]
        ${isActive 
          ? 'text-white scale-105 after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-2 after:h-2 after:bg-cyan-400 after:rounded-full after:animate-ping' 
          : 'text-zinc-600 font-normal scale-100'
        }
      `}
      style={{
        filter: isActive
          ? 'drop-shadow(0 0 5px rgba(34, 211, 238, 0.9)) drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
          : 'none',
      }}
    >
      {char}
    </span>
  )
}