import { CELL_SIZE } from '~/components/game/consts'
import type { TileWPT } from '~/core/map/tiles/TileWPT'
import { BaseTileEffect } from './DefaultTile'

export class WPTTile extends BaseTileEffect<TileWPT> {
  protected render() {
    const isActive = this.tile.hasEnergy
    const { timestamp } = this.context

    this.ctx.save()
    this.ctx.translate(this.centerX, this.centerY)
    this.ctx.rotate((15 * Math.PI) / 180)
    this.ctx.translate(-this.centerX, -this.centerY)

    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    if (isActive) {
      const duration = 1600
      const waveCount = 2

      for (let i = 0; i < waveCount; i++) {
        const progress = ((timestamp + i * (duration / waveCount)) % duration) / duration
        const radius = progress * (CELL_SIZE * 0.6)
        const alpha = 1 - progress

        this.ctx.save()
        this.ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.6})`
        this.ctx.lineWidth = 1.5
        this.ctx.beginPath()
        this.ctx.arc(this.centerX - 10, this.centerY - 3, radius, Math.PI * 0.85, Math.PI * 1.25)
        this.ctx.stroke()
        this.ctx.restore()
      }

      this.ctx.save()
      this.ctx.font = '800 14px monospace'

      this.ctx.shadowColor = 'rgba(59, 130, 246, 0.5)'
      this.ctx.shadowBlur = 10
      this.ctx.fillStyle = '#22d3ee'
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

      this.ctx.shadowColor = 'rgba(34, 211, 238, 0.9)'
      this.ctx.shadowBlur = 5
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)
      this.ctx.restore()
    } else {
      this.ctx.save()
      this.ctx.font = '400 14px monospace'
      this.ctx.fillStyle = '#52525b'
      this.ctx.shadowBlur = 0
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)
      this.ctx.restore()
    }

    this.ctx.restore()
  }
}