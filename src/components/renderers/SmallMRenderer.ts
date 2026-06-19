import { drawEyes } from './drawEyes'

export class SmallMRenderer {
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
