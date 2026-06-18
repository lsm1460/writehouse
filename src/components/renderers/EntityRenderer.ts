import { CELL_SIZE } from '~/components/game/consts'
import type { IMonsterTile } from '~/core/map/tiles/types'

const drawEyes = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timestamp: number,
  isMoving: boolean,
  direction: string | undefined,
  char: string,
  eyeRadius: number,
  pupilRadius: number
) => {
  let offsetX = 0
  let offsetY = 0

  if (isMoving) {
    const lookStrength = 2.0
    switch (direction) {
      case 'UP': offsetY = -lookStrength; break
      case 'DOWN': offsetY = lookStrength; break
      case 'LEFT': offsetX = -lookStrength; break
      case 'RIGHT': offsetX = lookStrength; break
    }
  } else {
    const time = timestamp * 0.003
    if (char === 'M') {
      offsetX = Math.sin(time) * 1.5
    } else if (char === 'm') {
      offsetY = Math.sin(time) * 1.5
    }
  }

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(x, y, eyeRadius, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.arc(x + offsetX, y + offsetY, pupilRadius, 0, Math.PI * 2)
  ctx.fill()
}

class BigMRenderer {
  static render(ctx: CanvasRenderingContext2D, centerX: number, bottomY: number, timestamp: number, isMoving: boolean, direction: string | undefined) {
    const phase = isMoving ? timestamp * 0.005 : 0
    const idleBob = isMoving ? 0 : Math.sin(timestamp * 0.003) * 1.5

    const offsetX = Math.sin(phase) * 2.5
    const smoothDir = Math.cos(phase)
    const halfW = 4.2
    const height = 10.0
    const topY = bottomY - height + idleBob

    const leftPhase = phase * 2
    const rightPhase = leftPhase + Math.PI

    const idleSpread = 1.5

    const leftFootX = isMoving
      ? centerX + offsetX - halfW + Math.cos(leftPhase) * 1.6 * smoothDir
      : centerX - halfW - idleSpread

    const rightFootX = isMoving
      ? centerX + offsetX + halfW + Math.cos(rightPhase) * 1.6 * smoothDir
      : centerX + halfW + idleSpread

    const leftFootY = isMoving
      ? bottomY - (Math.sin(leftPhase) > 0 ? Math.sin(leftPhase) * 1.3 * Math.abs(smoothDir) : 0)
      : bottomY

    const rightFootY = isMoving
      ? bottomY - (Math.sin(rightPhase) > 0 ? Math.sin(rightPhase) * 1.3 * Math.abs(smoothDir) : 0)
      : bottomY

    const topLeftX = centerX + offsetX - halfW + smoothDir * 0.4
    const topLeftY = topY + Math.sin(phase * 2) * 0.5

    const topRightX = centerX + offsetX + halfW + smoothDir * 0.4
    const topRightY = topY + Math.sin(phase * 2) * 0.5

    const centerVX = centerX + offsetX + smoothDir * 0.2
    const centerVY = topY + height * 0.55 + Math.sin(phase * 2) * 0.7

    const traceM = () => {
      ctx.beginPath()
      ctx.moveTo(leftFootX, leftFootY)
      ctx.lineTo(topLeftX, topLeftY)
      ctx.lineTo(centerVX, centerVY)
      ctx.lineTo(topRightX, topRightY)
      ctx.lineTo(rightFootX, rightFootY)
    }

    ctx.lineCap = 'square'
    ctx.lineJoin = 'miter'

    ctx.strokeStyle = '#1e1b4b'
    ctx.lineWidth = 4.2
    traceM()
    ctx.stroke()

    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2.0
    traceM()
    ctx.stroke()

    const eyeBaseY = (topLeftY + centerVY) / 2 + 0.5
    drawEyes(ctx, topLeftX * 0.6 + centerVX * 0.4, eyeBaseY, timestamp, isMoving, direction, 'M', 3.2, 1.2)
    drawEyes(ctx, topRightX * 0.6 + centerVX * 0.4, eyeBaseY, timestamp, isMoving, direction, 'M', 3.2, 1.2)
  }
}

class SmallMRenderer {
  static render(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    bottomY: number,
    timestamp: number,
    isMoving: boolean,
    direction: string | undefined
  ) {
    const phase = isMoving ? timestamp * 0.014 : 0
    const idleBob = isMoving ? 0 : Math.sin(timestamp * 0.003) * 1.0

    const jump = Math.sin(phase)
    const hopY = isMoving && jump > 0 ? -jump * 2.5 : 0

    const squash = isMoving ? Math.sin(phase) : 0
    const scaleX = 1 - squash * 0.06
    const scaleY = 1 + squash * 0.09

    ctx.save()
    ctx.translate(centerX, bottomY + idleBob)
    ctx.scale(scaleX, scaleY)
    ctx.translate(-centerX, -bottomY + idleBob + hopY)

    ctx.font = '900 12px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.strokeStyle = '#27272a'
    ctx.lineWidth = 3.0
    ctx.lineJoin = 'round'
    ctx.strokeText('m', centerX, centerY)

    ctx.fillStyle = '#f97316'
    ctx.fillText('m', centerX, centerY)

    drawEyes(ctx, centerX - 2.5, centerY - 1.5, timestamp, isMoving, direction, 'm', 2.4, 0.9)

    ctx.restore()
  }
}

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