import { CELL_SIZE } from '~/components/game/consts'

const renderBigM = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  bottomY: number,
  timestamp: number
) => {
  const walkSpeed = 0.005
  const phase = timestamp * walkSpeed

  const offsetX = Math.sin(phase) * 2.5
  const smoothDir = Math.cos(phase)
  const bobY = -Math.abs(Math.sin(phase * 2)) * 1.8

  const halfW = 4.2
  const height = 10.0
  const topY = bottomY - height

  const leftPhase = phase * 2
  const rightPhase = leftPhase + Math.PI

  const leftFootX = centerX + offsetX - halfW + Math.cos(leftPhase) * 1.6 * smoothDir
  const leftFootY = bottomY - (Math.sin(leftPhase) > 0 ? Math.sin(leftPhase) * 1.3 * Math.abs(smoothDir) : 0)

  const rightFootX = centerX + offsetX + halfW + Math.cos(rightPhase) * 1.6 * smoothDir
  const rightFootY = bottomY - (Math.sin(rightPhase) > 0 ? Math.sin(rightPhase) * 1.3 * Math.abs(smoothDir) : 0)

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

  ctx.fillStyle = '#fde047'
  ctx.beginPath()
  ctx.arc(topLeftX * 0.6 + centerVX * 0.4, topLeftY * 0.5 + centerVY * 0.5 + 0.5, 1.0, 0, Math.PI * 2)
  ctx.arc(topRightX * 0.6 + centerVX * 0.4, topRightY * 0.5 + centerVY * 0.5 + 0.5, 1.0, 0, Math.PI * 2)
  ctx.fill()
}

const renderSmallM = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  bottomY: number,
  timestamp: number
) => {
  ctx.font = '900 12px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const hopSpeed = 0.014
  const phase = timestamp * hopSpeed

  const jump = Math.sin(phase)
  const hopY = jump > 0 ? -jump * 2.5 : 0

  const squash = Math.sin(phase)
  const scaleX = 1 - squash * 0.06
  const scaleY = 1 + squash * 0.09

  ctx.translate(centerX, bottomY)
  ctx.scale(scaleX, scaleY)
  ctx.translate(-centerX, -bottomY + hopY)

  ctx.strokeStyle = '#27272a'
  ctx.lineWidth = 3.0
  ctx.lineJoin = 'round'
  ctx.strokeText('m', centerX, centerY)

  ctx.fillStyle = '#f97316'
  ctx.fillText('m', centerX, centerY)

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(centerX - 2.0, centerY - 0.5, 1.4, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#dc2626'
  ctx.beginPath()
  ctx.arc(centerX - 2.0, centerY - 0.5, 0.5, 0, Math.PI * 2)
  ctx.fill()
}

export const EntityRenderer = {
  render(ctx: CanvasRenderingContext2D, x: number, y: number, entity: any, timestamp: number, currentChar: string) {
    if (!entity) return

    
    const tilePixelX = x * CELL_SIZE
    const tilePixelY = y * CELL_SIZE
    const centerX = tilePixelX + CELL_SIZE / 2
    const centerY = tilePixelY + CELL_SIZE / 2
    const bottomY = centerY + CELL_SIZE * 0.15
    
    const char = entity.char || 'M'
    
    ctx.save()
    
    const isObscured = currentChar && currentChar.trim() !== ''
    if (isObscured) {
      ctx.globalAlpha = 0.6
    }

    if (char === 'M') {
      renderBigM(ctx, centerX, bottomY, timestamp)
    } else if (char === 'm') {
      renderSmallM(ctx, centerX, centerY, bottomY, timestamp)
    } else {
      ctx.font = '900 12px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#a855f7'
      ctx.fillText(char, centerX, centerY)
    }

    ctx.restore()
  },
}