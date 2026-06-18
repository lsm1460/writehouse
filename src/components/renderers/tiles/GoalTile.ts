import type { Tile } from '~/core/map/Tile'
import { BaseTileEffect } from './DefaultTile'

const sparkStartTimes = new WeakMap<Tile, number>()

export class GoalTile extends BaseTileEffect {
  protected render() {
    const { stageClear, timestamp } = this.context

    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    if (!stageClear) {
      if (sparkStartTimes.has(this.tile)) {
        sparkStartTimes.delete(this.tile)
      }

      this.ctx.globalAlpha = 0.4
      this.ctx.font = 'bold 14px monospace'
      this.ctx.fillStyle = '#737373'

      this.ctx.fillText('⚑', this.centerX, this.centerY)
    } else {
      if (!sparkStartTimes.has(this.tile)) {
        sparkStartTimes.set(this.tile, timestamp)
      }

      const startTime = sparkStartTimes.get(this.tile)!
      const elapsed = timestamp - startTime
      const animationDuration = 500

      const pulse = 0.85 + Math.sin(timestamp * 0.005) * 0.15
      this.ctx.save()
      this.ctx.shadowColor = '#ef4444'
      this.ctx.shadowBlur = 10
      this.ctx.fillStyle = 'rgba(220, 38, 38, 0.15)'
      this.ctx.beginPath()
      this.ctx.arc(this.centerX, this.centerY, 8 * pulse, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()

      if (elapsed < animationDuration) {
        const sparkProgress = elapsed / animationDuration
        const startRadius = 6 + sparkProgress * 12
        const sparkLength = 5
        const sparkAlpha = 1 - sparkProgress

        this.ctx.save()
        this.ctx.translate(this.centerX, this.centerY)
        this.ctx.lineWidth = 1.5
        this.ctx.lineCap = 'round'

        for (let i = 0; i < 6; i++) {
          this.ctx.save()
          this.ctx.rotate((i * 60 * Math.PI) / 180)

          const grad = this.ctx.createLinearGradient(0, startRadius, 0, startRadius + sparkLength)
          grad.addColorStop(0, `rgba(239, 68, 68, ${sparkAlpha})`)
          grad.addColorStop(1, `rgba(255, 255, 255, ${sparkAlpha})`)

          this.ctx.strokeStyle = grad
          this.ctx.beginPath()
          this.ctx.moveTo(0, startRadius)
          this.ctx.lineTo(0, startRadius + sparkLength)
          this.ctx.stroke()
          this.ctx.restore()
        }
        this.ctx.restore()
      }

      this.ctx.font = '900 16px monospace'
      this.ctx.shadowColor = 'rgba(239, 68, 68, 0.9)'
      this.ctx.shadowBlur = 8
      this.ctx.fillStyle = '#ef4444'

      this.ctx.fillText('⚑', this.centerX, this.centerY)
    }
  }
}
