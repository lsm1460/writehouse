import { memo, useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Tile } from '~/core/map/Tile'
import { ElectricOverlay } from './cell-frame/ElectricOverlay'
import { Tooltip } from './cell-frame/Tooltip'
import { getOpacity, getTileContext } from './cell-frame/utils'
import { WetOverlay } from './cell-frame/WetOverlay'
import { CELL_SIZE } from './consts'

interface CellFrameProps {
  lightLevel: number
  isPlayer: boolean
  isTarget: boolean
  children: ReactNode
  tile: Tile
  stageClear: boolean
  isLightActive: boolean
}

export const CellFrame = memo(function CellFrame({
  lightLevel,
  isPlayer,
  isTarget,
  children,
  tile,
  stageClear,
  isLightActive,
}: CellFrameProps) {
  const { t } = useTranslation()

  const charKey = tile.char.trim()
  const { isWet, isElectrified } = tile

  const tileContext = useMemo(() => {
    if (!charKey) return undefined
    return getTileContext(charKey, {
      stageClear,
      isActive: isLightActive,
      isWet,
      isElectrified,
    })
  }, [charKey, stageClear, isLightActive, isWet, isElectrified])

  const label = t(`char.${charKey}.label`, { context: tileContext, defaultValue: '' })
  const example = charKey ? t(`char.${charKey}.example`, { defaultValue: '' }) : ''
  const hasTooltip = isTarget && !!label.trim()

  const frameClass = useMemo(() => {
    const baseClass =
      'relative flex items-center justify-center text-base font-bold transition-colors duration-150 select-none text-neutral-300 border border-transparent z-0 isolate'
    const bgClass = tile.char === 'H' ? 'bg-black' : 'bg-neutral-900'
    const playerClass = isPlayer ? 'font-black z-10' : ''
    const targetClass = isTarget ? 'z-30' : ''

    return `${baseClass} ${bgClass} ${playerClass} ${targetClass}`
  }, [tile.char, isPlayer, isTarget])

  const opacityStyle = useMemo(() => getOpacity(lightLevel), [lightLevel])

  return (
    <span
      className={frameClass}
      style={{
        opacity: opacityStyle,
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
    >
      {hasTooltip && <Tooltip label={label} example={example} />}

      {isWet && <WetOverlay />}

      {isElectrified && <ElectricOverlay isWet={isWet} />}

      <span className="relative z-10 flex-1 h-full">{children}</span>
    </span>
  )
})
