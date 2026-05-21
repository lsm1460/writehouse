import { Tile } from '~/core/map/Tile'
import type { LightState } from '~/core/types'
import { CellFrame } from './CellFrame'
import { CELL_COMPONENTS } from './cells'
import { CellDefault } from './cells/CellDefault'

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

  const cellContent = isPlayer ? '@' : <TargetCell char={tile.char} lightState={lightState} stageClear={stageClear} />

  return (
    <CellFrame lightLevel={lightLevel} isPlayer={isPlayer} isTarget={isTarget}>
      {cellContent}
    </CellFrame>
  )
}
