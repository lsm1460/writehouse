import { CELL_SIZE } from '~/components/game/consts'
import { BaseTileEffect } from './DefaultTile'

interface AshParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

const particleCache = new WeakMap<any, AshParticle[]>()

export class AshpanTile extends BaseTileEffect {
  protected render() {
    this.renderParticles()
    this.renderText()
  }

  private renderParticles() {
    if (!particleCache.has(this.tile)) {
      particleCache.set(this.tile, [])
    }
    const particles = particleCache.get(this.tile)!

    if (particles.length < 8 && Math.random() < 0.2) {
      const maxLife = 25 + Math.random() * 25
      const colors = ['#ef4444', '#f97316', '#fde047', '#4b5563', '#374151']
      particles.push({
        x: this.centerX + (Math.random() - 0.5) * (CELL_SIZE * 0.7),
        y: this.pixelY + CELL_SIZE - 4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.2 + Math.random() * 0.3),
        life: 1.0,
        maxLife,
        size: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    this.ctx.save()
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.life -= 1 / p.maxLife

      if (p.life <= 0) {
        particles.splice(i, 1)
        continue
      }

      this.ctx.fillStyle = p.color
      this.ctx.globalAlpha = p.life
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
      this.ctx.fill()
    }
    this.ctx.restore()
  }

  private renderText() {
    const { timestamp } = this.context
    const pulseAlpha = 0.7 + Math.sin(timestamp * 0.005) * 0.3

    this.ctx.save()
    this.ctx.globalAlpha = pulseAlpha
    this.ctx.font = '900 14px D2Coding'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = -1
    this.ctx.shadowBlur = 3
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

    this.ctx.shadowColor = 'rgba(249, 115, 22, 0.4)'
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 4
    this.ctx.shadowBlur = 6
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

    this.ctx.shadowColor = 'rgba(239, 68, 68, 0.8)'
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
    this.ctx.shadowBlur = 4
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

    const gradient = this.ctx.createLinearGradient(0, this.pixelY + CELL_SIZE, 0, this.pixelY)
    gradient.addColorStop(0, '#ef4444')
    gradient.addColorStop(0.5, '#f97316')
    gradient.addColorStop(1, '#fde047')

    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
    this.ctx.fillStyle = gradient
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

    this.ctx.restore()
  }
}