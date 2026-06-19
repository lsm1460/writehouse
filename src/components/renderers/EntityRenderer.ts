import { CELL_SIZE } from '~/components/game/consts'
import type { IMonsterTile } from '~/core/map/tiles/types'
import { BigMRenderer } from './BigMRenderer'
import { SmallMRenderer } from './SmallMRenderer'

const MOVE_DURATION = 500

export const EntityRenderer = {
  render(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    entity: IMonsterTile,
    timestamp: number,
    currentChar: string
  ) {
    if (!entity) return

    if (entity.lastX === undefined) {
      entity.lastX = x
      entity.lastY = y
      entity.renderX = x
      entity.renderY = y
      entity.moveStartTime = 0
    }

    if (entity.lastX !== x || entity.lastY !== y) {
      entity.renderX = entity.lastX
      entity.renderY = entity.lastY
      entity.lastX = x
      entity.lastY = y
      entity.moveStartTime = timestamp
    }

    const elapsed = timestamp - entity.moveStartTime
    const progress = Math.min(elapsed / MOVE_DURATION, 1)
    const isMoving = progress < 1

    const visualX = entity.renderX + (x - entity.renderX) * progress
    const visualY = entity.renderY + (y - entity.renderY) * progress

    if (!isMoving) {
      entity.renderX = x
      entity.renderY = y
    }

    const centerX = visualX * CELL_SIZE + CELL_SIZE / 2
    const centerY = visualY * CELL_SIZE + CELL_SIZE / 2
    const bottomY = centerY + CELL_SIZE * 0.15

    ctx.save()
    if (currentChar && currentChar.trim() !== '') ctx.globalAlpha = 0.6

    if (entity.char === 'M') {
      BigMRenderer.render(ctx, centerX, bottomY, timestamp, isMoving, entity.direction)
    } else if (entity.char === 'm') {
      SmallMRenderer.render(ctx, centerX, centerY, bottomY, timestamp, isMoving, entity.direction)
    } else {
      ctx.font = '900 12px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#a855f7'
      ctx.fillText(entity.char, centerX, centerY)
    }

    ctx.restore()
  },
}
