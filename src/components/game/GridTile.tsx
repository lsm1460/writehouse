import React from 'react'
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
  lightState: any
  lightLevel: number
  entities: EntitiesType
  deathEvents: Map<string, any> | null | undefined
  playerPos: { x: number; y: number }
  targetPos: { x: number; y: number }
  stageClear: boolean
}

function GridTileComponent({
  x,
  y,
  tile,
  lightState,
  lightLevel,
  entities,
  deathEvents,
  playerPos,
  targetPos,
  stageClear,
}: GridTileProps) {
  const isPlayer = playerPos.x === x && playerPos.y === y
  const isTarget = targetPos.x === x && targetPos.y === y

  const entity = entities?.[y]?.[x]
  const currentDeath = deathEvents?.get(`${x},${y}`)

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

      <GridCell cell={renderable} />
    </div>
  )
}

export const GridTile = React.memo(GridTileComponent, (prevProps, nextProps) => {
  if (prevProps.x !== nextProps.x || prevProps.y !== nextProps.y) return false
  if (prevProps.stageClear !== nextProps.stageClear) return false
  if (prevProps.tile !== nextProps.tile || prevProps.tile.char !== nextProps.tile.char) return false
  if (prevProps.lightState !== nextProps.lightState) return false
  if (prevProps.lightLevel !== nextProps.lightLevel) return false

  const prevIsPlayer = prevProps.playerPos.x === prevProps.x && prevProps.playerPos.y === prevProps.y
  const nextIsPlayer = nextProps.playerPos.x === nextProps.x && nextProps.playerPos.y === nextProps.y
  if (prevIsPlayer !== nextIsPlayer) return false

  const prevIsTarget = prevProps.targetPos.x === prevProps.x && prevProps.targetPos.y === prevProps.y
  const nextIsTarget = nextProps.targetPos.x === nextProps.x && nextProps.targetPos.y === nextProps.y
  if (prevIsTarget !== nextIsTarget) return false

  const prevEntity = prevProps.entities?.[prevProps.y]?.[prevProps.x]
  const nextEntity = nextProps.entities?.[nextProps.y]?.[nextProps.x]
  if (prevEntity !== nextEntity) return false

  const prevDeath = prevProps.deathEvents?.get(`${prevProps.x},${prevProps.y}`)
  const nextDeath = nextProps.deathEvents?.get(`${nextProps.x},${nextProps.y}`)
  if (prevDeath !== nextDeath) return false

  return true
})
