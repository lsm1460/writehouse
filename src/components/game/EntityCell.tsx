import { useTranslation } from 'react-i18next'
import { Tile } from '~/core/map/Tile'
import { Tooltip } from './cell-frame/Tooltip'
import { CELL_COMPONENTS } from './cells'
import { CellDefault } from './cells/CellDefault'

interface EntityCellProps {
  entity: any
  stageClear: boolean
  cell: {
    tile: Tile
    lightLevel: number
    isTarget: boolean
  }
}

export function EntityCell({ entity, cell, stageClear }: EntityCellProps) {
  if (!entity) return null

  const { tile, lightLevel, isTarget } = cell

  const { t } = useTranslation()
  const label = t(`char.${entity.char}.label`, { defaultValue: '' })
  const hasTooltip = isTarget && !!label.trim()

  const TargetEntityCell = CELL_COMPONENTS[entity.char] || CellDefault

  const isOverlapping = tile && tile.char.trim() !== ''

  return (
    <div
      className={`absolute inset-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-200 ${
        isOverlapping ? 'opacity-60 scale-90' : 'opacity-100 scale-100'
      }`}
    >
      {hasTooltip && <Tooltip label={label} />}

      <TargetEntityCell char={entity.char} tile={entity} lightLevel={lightLevel} stageClear={stageClear} />
    </div>
  )
}
