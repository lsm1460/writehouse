import { useGame } from '~/context/GameContext'
import { Tile } from '~/core/map/Tile'
import type { LightState } from '~/core/types'
import { CellFrame } from './CellFrame'
import { CELL_COMPONENTS } from './cells'
import { CellDefault } from './cells/CellDefault'

interface GridCellProps {
  cell: {
    tile: Tile
    lightLevel: number
    lightState: LightState
    isPlayer: boolean
    isTarget: boolean
  }
}

export function GridCell({ cell }: GridCellProps) {
  const { stageClear, fog } = useGame()

  const { tile, lightLevel, lightState, isPlayer, isTarget } = cell
  const TargetCell = CELL_COMPONENTS[tile.char] || CellDefault
  const isLightActive = tile.char.trim() === 'i' && fog.getLightState(tile.x, tile.y).environmentIntensity > 0

  const backgroundTile =
    tile.char === 'H' ? (
      <></>
    ) : (
      <TargetCell char={tile.char} tile={tile} lightState={lightState} stageClear={stageClear} />
    )

  return (
    <CellFrame
      lightLevel={lightLevel}
      isPlayer={isPlayer}
      isTarget={isTarget}
      tile={tile}
      stageClear={stageClear}
      isLightActive={isLightActive}
    >
      <div className="inline-flex items-center justify-center w-full h-full ">
        {isPlayer && (
          <span
            className={`absolute inset-0 flex items-center justify-center text-white font-black z-10  ${
              tile.char.trim() ? 'opacity-40 scale-90' : 'opacity-100'
            }`}
            style={{ userSelect: 'none' }}
          >
            @
          </span>
        )}

        {backgroundTile}
      </div>
    </CellFrame>
  )
}
