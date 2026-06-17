import { TileRegistry } from './TileRegistry'
import { TileRenderer } from './TileRenderer'
import { Camera } from './Camera'
import type { FogSystem } from '~/core/systems/fogSystem'

interface RenderMapOptions {
  ctx: CanvasRenderingContext2D
  map: any
  player: any
  fog: FogSystem
  timestamp: number
  camera: Camera
}

export const MapRenderer = {
  render({ ctx, map, player, fog, timestamp, camera }: RenderMapOptions) {
    const { grid, entities } = map
    const { pos: playerPos } = player

    camera.update(playerPos.x, playerPos.y)

    ctx.fillStyle = '#0a0a0c'
    ctx.fillRect(0, 0, camera.viewWidth, camera.viewHeight)

    ctx.save()
    camera.apply(ctx)

    for (let y = 0; y < grid.length; y++) {
      const row = grid[y]
      for (let x = 0; x < row.length; x++) {
        const tile = row[x]
        if (!tile) continue

        if (!camera.isVisible(x, y)) {
          continue
        }

        const tileMeta = TileRegistry.getMetadata(tile.char)

        if (tileMeta.skipRender) {
          continue
        }

        const lightState = fog.getLightState(x, y)
        
        const lightLevel = tileMeta.lightLevelOverride !== undefined
          ? tileMeta.lightLevelOverride
          : fog.getLightLevel(x, y)

        TileRenderer.drawBackground(ctx, x, y, tile.char)

        if (tile.char.trim() && tile.char !== ' ') {
          tileMeta.renderer.render(ctx, x, y, tile.char, timestamp, lightState)
        }

        const entity = entities?.[y]?.[x]
        if (entity) {
          TileRenderer.drawEntity(ctx, x, y, entity)
        }

        // 이전 장막 효과 유지
        TileRenderer.drawFog(ctx, x, y, lightLevel)
      }
    }

    TileRenderer.drawPlayer(ctx, playerPos.x, playerPos.y)

    ctx.restore()
  },
}