// src/components/renderers/TooltipRenderer.ts
import { CELL_SIZE } from '~/components/game/consts'
import type { Tile } from '~/core/map/Tile'
import type { FogSystem } from '~/core/systems/fogSystem'
import i18n from '~/i18n'

const APPEAR_DELAY = 500
const FADE_DURATION = 200
const BUBBLE_OFFSET = 20
const BOUNCE_SPEED = 0.006
const BOUNCE_HEIGHT = 1

const OPACITY = 0.65
const BG_COLOR = `rgba(255, 255, 255, ${OPACITY})`
const BORDER_COLOR = '#1c1917'
const MAIN_TEXT_COLOR = '#1c1917'
const SUB_TEXT_COLOR = '#4b5563'

const TAIL_OFFSET_Y_UP = -8
const TAIL_OFFSET_Y_DOWN = 4

let lastTargetX = -1
let lastTargetY = -1
let targetStartTime = 0

interface RenderSystems {
  stageClear: boolean
  fog: FogSystem
  timestamp: number
}

interface RenderPositions {
  targetPos: { x: number; y: number }
  playerPos: { x: number; y: number }
}

interface TooltipLayout {
  bubbleX: number
  bubbleY: number
  bubbleWidth: number
  bubbleHeight: number
  bubbleCenterX: number
  bubbleCenterY: number
  bubbleBounceY: number
  tileCenterX: number
  tileCenterY: number
  tailOffsetY: number
}

function getTileContext(
  char: string,
  contextData: { stageClear: boolean; isActive: boolean; isWet: boolean; isElectrified: boolean }
): string | undefined {
  switch (char) {
    case 'G':
      return contextData.stageClear ? 'open' : 'closed'
    case 'i':
      return contextData.isActive ? 'active' : 'inactive'
    case 'g':
      return contextData.isElectrified ? 'el' : contextData.isWet ? 'wet' : ''
    default:
      return undefined
  }
}

function calculateLayout(
  positions: RenderPositions,
  timestamp: number,
  labelWidth: number,
  exampleWidth: number,
  hasExample: boolean
): TooltipLayout {
  const { targetPos, playerPos } = positions

  const paddingX = 8
  const bubbleWidth = Math.max(labelWidth, exampleWidth) + paddingX * 2
  const bubbleHeight = hasExample ? 26 : 16

  const tileCenterX = targetPos.x * CELL_SIZE + CELL_SIZE / 2
  const tileCenterY = targetPos.y * CELL_SIZE + CELL_SIZE / 2

  const pX = Math.floor(playerPos.x)
  const pY = Math.floor(playerPos.y)
  const tX = targetPos.x
  const tY = targetPos.y

  let offsetX = 0
  let offsetY = 0
  let tailOffsetY = TAIL_OFFSET_Y_DOWN

  if (pY > tY) {
    offsetY = -BUBBLE_OFFSET - bubbleHeight / 2
    offsetX = pX <= tX ? BUBBLE_OFFSET : -BUBBLE_OFFSET
  } else if (pY < tY) {
    offsetY = BUBBLE_OFFSET + bubbleHeight / 2
    offsetX = pX <= tX ? BUBBLE_OFFSET : -BUBBLE_OFFSET
    tailOffsetY = TAIL_OFFSET_Y_UP
  } else {
    if (pX <= tX) {
      offsetX = BUBBLE_OFFSET
      offsetY = -BUBBLE_OFFSET - bubbleHeight / 2
    } else {
      offsetX = -BUBBLE_OFFSET
      offsetY = -BUBBLE_OFFSET - bubbleHeight / 2
    }
  }

  const bubbleBounceY = Math.sin(timestamp * BOUNCE_SPEED) * BOUNCE_HEIGHT
  const bubbleCenterX = tileCenterX + offsetX
  const bubbleCenterY = tileCenterY + offsetY + bubbleBounceY

  const bubbleX = bubbleCenterX - bubbleWidth / 2
  const bubbleY = bubbleCenterY - bubbleHeight / 2

  return {
    bubbleX,
    bubbleY,
    bubbleWidth,
    bubbleHeight,
    bubbleCenterX,
    bubbleCenterY,
    bubbleBounceY,
    tileCenterX,
    tileCenterY,
    tailOffsetY,
  }
}

function drawBubbleBody(ctx: CanvasRenderingContext2D, layout: TooltipLayout) {
  ctx.fillStyle = BG_COLOR
  ctx.strokeStyle = BORDER_COLOR
  ctx.lineWidth = 1.2

  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(layout.bubbleX, layout.bubbleY, layout.bubbleWidth, layout.bubbleHeight, 4)
  } else {
    ctx.rect(layout.bubbleX, layout.bubbleY, layout.bubbleWidth, layout.bubbleHeight)
  }
  ctx.fill()
  ctx.stroke()
}

function drawBubbleText(ctx: CanvasRenderingContext2D, layout: TooltipLayout, label: string, example: string) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (example.trim()) {
    ctx.font = 'bold 9px sans-serif'
    ctx.fillStyle = MAIN_TEXT_COLOR
    ctx.fillText(label, layout.bubbleCenterX, layout.bubbleY + 8)
    ctx.font = '8px monospace'
    ctx.fillStyle = SUB_TEXT_COLOR
    ctx.fillText(example, layout.bubbleCenterX, layout.bubbleY + layout.bubbleHeight - 5)
  } else {
    ctx.font = 'bold 9px sans-serif'
    ctx.fillStyle = MAIN_TEXT_COLOR
    ctx.fillText(label, layout.bubbleCenterX, layout.bubbleCenterY + 1)
  }
}

function drawBubbleTail(ctx: CanvasRenderingContext2D, layout: TooltipLayout, timestamp: number) {
  const tVecX = layout.tileCenterX - layout.bubbleCenterX
  const tVecY = layout.tileCenterY - (layout.bubbleCenterY - layout.bubbleBounceY)
  const len = Math.sqrt(tVecX * tVecX + tVecY * tVecY) || 1
  const dirX = tVecX / len
  const dirY = tVecY / len

  const startDist = Math.min(layout.bubbleWidth, layout.bubbleHeight) * 0.35

  const tail1BounceY = Math.sin(timestamp * BOUNCE_SPEED - Math.PI * 0.33) * BOUNCE_HEIGHT
  const tail1X = layout.bubbleCenterX + dirX * startDist
  const tail1Y = layout.bubbleCenterY - layout.bubbleBounceY + dirY * startDist + tail1BounceY

  const tail2BounceY = Math.sin(timestamp * BOUNCE_SPEED - Math.PI * 0.8) * (BOUNCE_HEIGHT + 0.2)
  const tail2X = layout.bubbleCenterX + dirX * (startDist + 6)
  const tail2Y = layout.bubbleCenterY - layout.bubbleBounceY + dirY * (startDist + 6) + tail2BounceY

  ctx.fillStyle = BG_COLOR

  ctx.beginPath()
  ctx.arc(tail1X, tail1Y + layout.tailOffsetY + 1, 2.0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(tail2X, tail2Y + layout.tailOffsetY, 1.0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
}

export const TooltipRenderer = {
  render(ctx: CanvasRenderingContext2D, tile: Tile, positions: RenderPositions, systems: RenderSystems) {
    if (!tile || !tile.char) return

    const { targetPos } = positions
    const { stageClear, fog, timestamp } = systems

    if (lastTargetX !== targetPos.x || lastTargetY !== targetPos.y) {
      lastTargetX = targetPos.x
      lastTargetY = targetPos.y
      targetStartTime = timestamp
    }

    const elapsed = timestamp - targetStartTime
    if (elapsed < APPEAR_DELAY) return

    const isLightActive = tile.char.trim() === 'i' && fog.getLightState(tile.x, tile.y).environmentIntensity > 0
    const tileContext = getTileContext(tile.char, {
      stageClear,
      isActive: isLightActive,
      isWet: tile.isWet,
      isElectrified: tile.isElectrified,
    })

    const label = i18n.t(`char.${tile.char}.label`, { context: tileContext, defaultValue: '' })
    const example = tile.char ? i18n.t(`char.${tile.char}.example`, { defaultValue: '' }) : ''

    if (!label.trim()) return

    const fadeElapsed = elapsed - APPEAR_DELAY
    const currentAlpha = Math.min(fadeElapsed / FADE_DURATION, 1)

    ctx.save()
    ctx.globalAlpha = currentAlpha

    ctx.font = 'bold 9px sans-serif'
    const labelWidth = ctx.measureText(label).width
    ctx.font = '8px monospace'
    const exampleWidth = example.trim() ? ctx.measureText(example).width : 0

    const layout = calculateLayout(positions, timestamp, labelWidth, exampleWidth, !!example.trim())

    drawBubbleBody(ctx, layout)
    drawBubbleText(ctx, layout, label, example)
    drawBubbleTail(ctx, layout, timestamp)

    ctx.restore()
  },
}
