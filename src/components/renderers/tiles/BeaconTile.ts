import { CELL_SIZE } from '~/components/game/consts'
import type { Tilei } from '~/core/map/tiles/Tile_i'
import { BaseTileEffect } from './DefaultTile'

const shockwaveStartTimes = new WeakMap<Tilei, number>()

export class BeaconTile extends BaseTileEffect<Tilei> {
  private get beaconY() {
    return this.pixelY + CELL_SIZE * 0.27
  }

  protected render() {
    const { lightState, timestamp } = this.context
    const isActive = lightState.environmentIntensity > 0

    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    if (!isActive) {
      if (shockwaveStartTimes.has(this.tile)) {
        shockwaveStartTimes.delete(this.tile)
      }

      this.ctx.font = '500 14px monospace'
      this.ctx.fillStyle = '#737373'
      this.ctx.fillText('i', this.centerX, this.centerY)
    } else {
      if (!shockwaveStartTimes.has(this.tile)) {
        shockwaveStartTimes.set(this.tile, timestamp)
      }

      const startTime = shockwaveStartTimes.get(this.tile)!
      const elapsed = timestamp - startTime
      const animationDuration = 600

      const pulse = 0.8 + Math.sin(timestamp * 0.005) * 0.2

      this.ctx.save()
      this.ctx.shadowColor = '#fdba74'
      this.ctx.shadowBlur = 10
      this.ctx.fillStyle = '#fdba74'
      this.ctx.beginPath()
      this.ctx.arc(this.centerX, this.beaconY, 3 * pulse, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()

      if (elapsed < animationDuration) {
        const waveProgress = elapsed / animationDuration
        const waveRadius = 4 + waveProgress * 12
        const waveAlpha = 1 - waveProgress

        this.ctx.save()
        this.ctx.strokeStyle = `rgba(251, 146, 60, ${waveAlpha})`
        this.ctx.fillStyle = `rgba(249, 115, 22, ${waveAlpha * 0.05})`
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        this.ctx.arc(this.centerX, this.beaconY, waveRadius, 0, Math.PI * 2)
        this.ctx.fill()
        this.ctx.stroke()
        this.ctx.restore()
      }

      this.ctx.font = '900 14px monospace'
      this.ctx.shadowColor = 'rgba(251, 146, 60, 0.6)'
      this.ctx.shadowBlur = 4
      this.ctx.fillStyle = '#fb923c'
      this.ctx.fillText('i', this.centerX, this.centerY)
    }
  }
}
