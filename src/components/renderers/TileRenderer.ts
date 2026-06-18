import { CELL_SIZE } from '../game/consts'

export const OPACITY_LEVELS = [0.15, 0.6, 0.75, 0.9, 1.0]
export const getOpacity = (level: number) => OPACITY_LEVELS[level] ?? 1.0

export const TileRenderer = {
  drawBackground(ctx: CanvasRenderingContext2D, x: number, y: number, char: string) {
    const tilePixelX = x * CELL_SIZE
    const tilePixelY = y * CELL_SIZE

    const tileBgColor = char === '#' ? '#3f3f46' : '#1e1e24'

    ctx.fillStyle = tileBgColor
    ctx.fillRect(tilePixelX, tilePixelY, CELL_SIZE, CELL_SIZE)

    ctx.rect(tilePixelX, tilePixelY, CELL_SIZE, CELL_SIZE)
  },

  drawEntity(ctx: CanvasRenderingContext2D, x: number, y: number, entity: any) {
    if (!entity) return

    const tilePixelX = x * CELL_SIZE
    const tilePixelY = y * CELL_SIZE

    ctx.fillStyle = '#ef4444' // 기본 엔티티 (빨간색)
    if (entity.type === 'ITEM' || entity.type === 'MIXED') {
      ctx.fillStyle = '#60a5fa' // 아이템 (하늘색)
    }

    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(entity.char || 'E', tilePixelX + CELL_SIZE / 2, tilePixelY + CELL_SIZE / 2 - 2)
  },

  drawFog(ctx: CanvasRenderingContext2D, x: number, y: number, lightLevel: number) {
    const tilePixelX = x * CELL_SIZE
    const tilePixelY = y * CELL_SIZE

    const tileVisibility = getOpacity(lightLevel)

    const shadowOpacity = 1 - tileVisibility

    if (shadowOpacity <= 0) return

    ctx.fillStyle = `rgba(10, 10, 12, ${shadowOpacity})`
    ctx.fillRect(tilePixelX, tilePixelY, CELL_SIZE, CELL_SIZE)
  },

  drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, currentChar?: string) {
    ctx.save()

    const isObscured = currentChar && currentChar.trim() !== ''

    if (isObscured) {
      ctx.globalAlpha = 0.8
    }

    const playerX = x * CELL_SIZE
    const playerY = y * CELL_SIZE
    const centerX = playerX + CELL_SIZE / 2
    const centerY = playerY + CELL_SIZE / 2

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('@', centerX, centerY)

    ctx.restore()
  },
}
