import { Camera } from './Camera'
import { EffectRenderer } from './EffectRenderer'
import { EntityRenderer } from './EntityRenderer'
import { TileRegistry } from './TileRegistry'
import { TileRenderer } from './TileRenderer'
import { TooltipRenderer } from './TooltipRenderer'
import type { DeathEvent } from '~/core/systems/EffectSystem'
import type { FogSystem } from '~/core/systems/fogSystem'
import type { MapSystem } from '~/core/systems/mapSystem'
import type { PlayerSystem } from '~/core/systems/playerSystem'

interface RenderMapOptions {
  ctx: CanvasRenderingContext2D
  map: MapSystem
  player: PlayerSystem
  fog: FogSystem
  deathEvents: DeathEvent[]
  stageClear: boolean
  timestamp: number
  camera: Camera
}

function clearAndPrepareScreen(ctx: CanvasRenderingContext2D, camera: Camera, playerPos: { x: number; y: number }) {
  camera.update(playerPos.x, playerPos.y)
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, camera.viewWidth, camera.viewHeight)
  ctx.save()
  camera.apply(ctx)
}

function drawBackgroundTiles(ctx: CanvasRenderingContext2D, grid: any[][], camera: Camera) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (!camera.isVisible(x, y)) continue
      const tile = grid[y][x]
      if (!tile) continue

      const tileMeta = TileRegistry.getMetadata(tile.char)
      if (tileMeta.skipRender) continue

      TileRenderer.drawBackground(ctx, x, y, tile.char)
    }
  }
}

function drawEntities(ctx: CanvasRenderingContext2D, grid: any[][], entities: any[][], timestamp: number) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const entity = entities?.[y]?.[x]
      if (entity) {
        EntityRenderer.render(ctx, x, y, entity, timestamp, grid[y][x]?.char || '')
      }
    }
  }
}

function drawTileLayers(
  ctx: CanvasRenderingContext2D,
  grid: any[][],
  camera: Camera,
  playerPos: { x: number; y: number },
  fog: FogSystem,
  stageClear: boolean,
  timestamp: number
) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (!camera.isVisible(x, y)) continue
      const tile = grid[y][x]
      if (!tile) continue

      if (tile.isWet) EffectRenderer.drawWetOverlay(ctx, x, y, timestamp)
      if (tile.isElectrified) EffectRenderer.drawElectricOverlay(ctx, x, y, timestamp, tile.isWet)

      if (x === Math.floor(playerPos.x) && y === Math.floor(playerPos.y)) {
        TileRenderer.drawPlayer(ctx, playerPos.x, playerPos.y, tile.char)
      }

      if (tile.char && tile.char.trim() && tile.char !== ' ') {
        const tileMeta = TileRegistry.getMetadata(tile.char)
        tileMeta.renderer.draw(ctx, tile, {
          stageClear,
          timestamp,
          lightState: fog.getLightState(x, y),
        })
      }

      const lightLevel = TileRegistry.getMetadata(tile.char).lightLevelOverride ?? fog.getLightLevel(x, y)
      TileRenderer.drawFog(ctx, x, y, lightLevel)
    }
  }
}

function drawTargetTooltip(
  ctx: CanvasRenderingContext2D,
  grid: any[][],
  targetPos: { x: number; y: number },
  playerPos: { x: number; y: number },
  camera: Camera,
  fog: FogSystem,
  stageClear: boolean,
  timestamp: number
) {
  const targetTile = grid[targetPos.y]?.[targetPos.x]
  if (targetTile && camera.isVisible(targetPos.x, targetPos.y)) {
    TooltipRenderer.render(ctx, targetTile, { playerPos, targetPos }, { stageClear, fog, timestamp })
  }
}

function drawDeathEvents(ctx: CanvasRenderingContext2D, deathEvents: DeathEvent[], camera: Camera, timestamp: number) {
  deathEvents.forEach((event) => {
    if (camera.isVisible(event.x, event.y)) {
      EffectRenderer.drawMonsterDeath(ctx, event.x, event.y, timestamp)
    }
  })
}

export const GameRenderer = {
  render({ ctx, map, player, fog, timestamp, stageClear, camera, deathEvents }: RenderMapOptions) {
    const { grid, entities } = map
    const { pos: playerPos, targetPos } = player

    clearAndPrepareScreen(ctx, camera, playerPos)
    drawBackgroundTiles(ctx, grid, camera)
    drawEntities(ctx, grid, entities, timestamp)
    drawTileLayers(ctx, grid, camera, playerPos, fog, stageClear, timestamp)
    drawTargetTooltip(ctx, grid, targetPos, playerPos, camera, fog, stageClear, timestamp)
    drawDeathEvents(ctx, deathEvents, camera, timestamp)

    ctx.restore()
  },
}