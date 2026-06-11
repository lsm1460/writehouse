import type { Tile } from '~/core/map/Tile'
import type { EntitiesType } from '~/core/types'
import { CELL_SIZE } from './consts'
import { DeathEffect } from './DeathEffect'
import { EntityCell } from './EntityCell'
import { GridCell } from './GridCell'

interface GridTileProps {
  x: number
  y: number
  tile: Tile
  fog: {
    getLightState: (x: number, y: number) => any
    getLightLevel: (x: number, y: number) => number
  }
  entities: EntitiesType
  deathEvents: any[] | null | undefined
  playerPos: { x: number; y: number }
  targetPos: { x: number; y: number }
  stageClear: boolean
}

export function GridTile({
  x,
  y,
  tile,
  fog,
  entities,
  deathEvents,
  playerPos,
  targetPos,
  stageClear,
}: GridTileProps) {
  const isPlayer = playerPos.x === x && playerPos.y === y
  const isTarget = targetPos.x === x && targetPos.y === y
  
  const lightState = fog.getLightState(x, y)
  const lightLevel = fog.getLightLevel(x, y)

  const entity = entities?.[y]?.[x]
  const currentDeath = deathEvents?.find((e: any) => e.x === x && e.y === y)

  const renderable = {
    tile,
    lightLevel: ['G', 'i'].includes(tile.char) ? 9 : lightLevel,
    lightState,
    isPlayer,
    isTarget,
  }

  return (
    <div className="relative stage-grid" style={{ width: CELL_SIZE, height: CELL_SIZE }}>
      <EntityCell cell={renderable} entity={entity} stageClear={stageClear} />

      {currentDeath && <DeathEffect reason={currentDeath.reason} />}

      <GridCell cell={renderable} stageClear={stageClear} />
    </div>
  )
}