import { CELL_SIZE } from '~/components/game/consts'
import type { TileD } from '~/core/map/tiles/TileD'
import { BaseTileEffect } from './DefaultTile'

export class DetectorTile extends BaseTileEffect<TileD> {
  protected render() {
    const isActive = this.tile.hasEnergy
    const size = CELL_SIZE

    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    if (isActive) {
      const { timestamp } = this.context
      const pulseAlpha = 0.75 + Math.sin(timestamp * 0.005) * 0.25

      this.ctx.save()
      this.ctx.globalAlpha = pulseAlpha
      this.ctx.font = '800 14px D2Coding'
      this.ctx.fillStyle = '#22d3ee'

      this.ctx.shadowColor = 'rgba(59, 130, 246, 0.4)'
      this.ctx.shadowBlur = 8
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

      this.ctx.shadowColor = 'rgba(34, 211, 238, 0.8)'
      this.ctx.shadowBlur = 4
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)
      this.ctx.restore()

      this.ctx.save()
      const radarRadius = (timestamp * 0.012) % (size * 0.6)
      const radarAlpha = 1 - radarRadius / (size * 0.6)
      
      this.ctx.strokeStyle = `rgba(239, 68, 68, ${radarAlpha * 0.7})`
      this.ctx.lineWidth = 1.5
      this.ctx.beginPath()
      this.ctx.arc(this.centerX, this.centerY, radarRadius, 0, Math.PI * 2)
      this.ctx.stroke()
      
      const scanY = this.pixelY + (size * 0.1) + ((timestamp * 0.02) % (size * 0.8))
      this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'
      this.ctx.lineWidth = 1
      this.ctx.beginPath()
      this.ctx.moveTo(this.pixelX + 2, scanY)
      this.ctx.lineTo(this.pixelX + size - 2, scanY)
      this.ctx.stroke()

      const ledBlink = Math.floor(timestamp * 0.006) % 2 === 0
      if (ledBlink) {
        this.ctx.fillStyle = '#ef4444'
        this.ctx.shadowColor = '#ef4444'
        this.ctx.shadowBlur = 4
        this.ctx.beginPath()
        this.ctx.arc(this.pixelX + size - 5, this.pixelY + 5, 2, 0, Math.PI * 2)
        this.ctx.fill()
      }
      this.ctx.restore()
    } else {
      this.ctx.save()
      this.ctx.font = '800 14px D2Coding'
      this.ctx.fillStyle = '#52525b'
      this.ctx.shadowBlur = 0
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)
      
      this.ctx.fillStyle = '#22c55e'
      this.ctx.globalAlpha = 0.4
      this.ctx.beginPath()
      this.ctx.arc(this.pixelX + size - 5, this.pixelY + 5, 1.5, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()
    }
  }
}