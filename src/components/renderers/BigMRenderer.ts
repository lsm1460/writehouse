import { drawEyes } from './drawEyes'

export class BigMRenderer {
  static render(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    bottomY: number,
    timestamp: number,
    isMoving: boolean,
    direction: string | undefined
  ) {
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
