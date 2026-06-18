import { CELL_SIZE } from '~/components/game/consts'
import type { TileE } from '~/core/map/tiles/TileE'
import { BaseTileEffect } from './DefaultTile'

export class EnergyTile extends BaseTileEffect<TileE> {
  protected render(): void {
    const isActive = this.tile.hasEnergy

    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    if (isActive) {
      const { timestamp } = this.context
      const pulseAlpha = 0.8 + Math.sin(timestamp * 0.003) * 0.2

      this.ctx.save()
      this.ctx.globalAlpha = pulseAlpha

      this.ctx.font = '800 14px monospace'
      this.ctx.fillStyle = '#22d3ee'

      this.ctx.shadowColor = 'rgba(59, 130, 246, 0.4)'
      this.ctx.shadowBlur = 6
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

      this.ctx.shadowColor = 'rgba(34, 211, 238, 0.8)'
      this.ctx.shadowBlur = 3
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)
      this.ctx.restore()

      this.drawEnergyFlow(timestamp)
    } else {
      this.ctx.font = '400 14px monospace'
      this.ctx.fillStyle = '#52525b'
      this.ctx.shadowBlur = 0
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)
    }
  }

  private drawEnergyFlow(timestamp: number) {
    const size = CELL_SIZE
    const px = this.pixelX
    const py = this.pixelY

    this.ctx.save()
    
    const waveRadius = (timestamp * 0.015) % (size * 0.5)
    const waveAlpha = 1 - waveRadius / (size * 0.5)
    
    this.ctx.strokeStyle = `rgba(34, 211, 238, ${waveAlpha * 0.4})`
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.arc(this.centerX, this.centerY, waveRadius, 0, Math.PI * 2)
    this.ctx.stroke()

    const particleCount = 3
    this.ctx.fillStyle = '#22d3ee'
    
    for (let i = 0; i < particleCount; i++) {
      const seed = i * 23
      const progress = ((timestamp + seed * 30) % 1500) / 1500
      
      const x = px + size * 0.25 + ((seed + timestamp * 0.005) % (size * 0.5))
      const y = py + size * 0.75 - progress * (size * 0.5)
      const pAlpha = (1 - progress) * 0.6

      this.ctx.globalAlpha = pAlpha
      this.ctx.fillRect(x, y, 1.5, 1.5)
    }

    this.ctx.restore()
  }
}