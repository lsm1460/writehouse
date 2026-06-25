import { CELL_SIZE } from '~/components/game/consts'
import { BaseTileEffect } from './DefaultTile'

const oilOffsets = new WeakMap<any, number>()

export class OilTile extends BaseTileEffect {
  protected render() {
    const { timestamp } = this.context

    if (!oilOffsets.has(this.tile)) {
      oilOffsets.set(this.tile, Math.random() * 2500)
    }
    const offset = oilOffsets.get(this.tile)!

    this.ctx.save()
    this.ctx.font = '900 14px D2Coding'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillStyle = '#0a0a0a'

    this.ctx.shadowColor = 'rgba(163, 230, 53, 0.2)'
    this.ctx.shadowBlur = 15
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
    this.ctx.shadowBlur = 8
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.7)'
    this.ctx.shadowBlur = 3
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY)
    this.ctx.restore()

    this.drawPuddle(timestamp)
    this.drawDrip(timestamp, offset)
  }

  private drawPuddle(timestamp: number) {
    const bx = this.centerX
    const by = this.pixelY + CELL_SIZE
    const pulse = Math.sin(timestamp * 0.003) * 0.6

    this.ctx.save()
    this.ctx.fillStyle = '#0a0a0a'
    this.ctx.beginPath()
    this.ctx.ellipse(bx, by - 1, CELL_SIZE * 0.35 + pulse, CELL_SIZE * 0.08, 0, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
  }

  private drawDrip(timestamp: number, offset: number) {
    const size = CELL_SIZE
    const duration = 2500
    const progress = ((timestamp + offset) % duration) / duration

    const startY = this.centerY + 2
    const endY = this.pixelY + size - 2
    const y = startY + (endY - startY) * progress

    this.ctx.save()
    this.ctx.fillStyle = '#0a0a0a'
    
    if (progress < 0.92) {
      this.ctx.beginPath()
      const stretchY = 1.2 + progress * 0.8
      const shrinkX = 1.1 - progress * 0.2
      this.ctx.ellipse(this.centerX, y, shrinkX, stretchY, 0, 0, Math.PI * 2)
      this.ctx.fill()
    }
    this.ctx.restore()
  }
}