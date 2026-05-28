import { Tile } from '~/core/map/Tile'
import type { LightState } from '~/core/types'
import { CellFrame } from './CellFrame'
import { CELL_COMPONENTS } from './cells'
import { CellDefault } from './cells/CellDefault'
import { CELL_SIZE } from './consts'

interface GridCellProps {
  stageClear: boolean
  cell: {
    tile: Tile
    lightLevel: number
    lightState: LightState
    isPlayer: boolean
    isTarget: boolean
  }
}

export function GridCell({ stageClear, cell }: GridCellProps) {
  const { tile, lightLevel, lightState, isPlayer, isTarget } = cell
  const TargetCell = CELL_COMPONENTS[tile.char] || CellDefault

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
      isWet={tile.isWet}
      isElectrified={tile.isElectrified}
      isHole={tile.char === 'H'}
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
