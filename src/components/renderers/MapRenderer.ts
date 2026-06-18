import type { FogSystem } from '~/core/systems/fogSystem'
import type { MapSystem } from '~/core/systems/mapSystem'
import type { PlayerSystem } from '~/core/systems/playerSystem'
import { Camera } from './Camera'
import { EffectRenderer } from './EffectRenderer'
import { EntityRenderer } from './EntityRenderer'
import { TileRegistry } from './TileRegistry'
import { TileRenderer } from './TileRenderer'

interface RenderMapOptions {
  ctx: CanvasRenderingContext2D
  map: MapSystem
  player: PlayerSystem
  fog: FogSystem
  stageClear: boolean
  timestamp: number
  camera: Camera
}

export const MapRenderer = {
  render({ ctx, map, player, fog, timestamp, stageClear, camera }: RenderMapOptions) {
    const { grid, entities } = map
    const { pos: playerPos } = player

    camera.update(playerPos.x, playerPos.y)

    ctx.fillStyle = '#0a0a0c'
    ctx.fillRect(0, 0, camera.viewWidth, camera.viewHeight)

    ctx.save()
    camera.apply(ctx)

    const playerGridX = Math.floor(playerPos.x)
    const playerGridY = Math.floor(playerPos.y)

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

        const lightLevel =
          tileMeta.lightLevelOverride !== undefined ? tileMeta.lightLevelOverride : fog.getLightLevel(x, y)

        TileRenderer.drawBackground(ctx, x, y, tile.char)

        if (tile.isWet) {
          EffectRenderer.drawWetOverlay(ctx, x, y, timestamp)
        }

        if (tile.isElectrified) {
          // 컴포넌트 내부에서 사용하던 isWet 플래그를 그대로 넘겨서 색상 변화 감지
          EffectRenderer.drawElectricOverlay(ctx, x, y, timestamp, tile.isWet)
        }

        if (x === playerGridX && y === playerGridY) {
          TileRenderer.drawPlayer(ctx, playerPos.x, playerPos.y, tile.char)
        }

        if (tile.char.trim() && tile.char !== ' ') {
          tileMeta.renderer.draw(ctx, tile, { stageClear, timestamp, lightState })
        }

        const entity = entities?.[y]?.[x]
        if (entity) {
          EntityRenderer.render(ctx, x, y, entity, timestamp)
        }

        TileRenderer.drawFog(ctx, x, y, lightLevel)
      }
    }

    ctx.restore()
  },
}