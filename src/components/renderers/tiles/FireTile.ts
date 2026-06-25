import { CELL_SIZE } from '~/components/game/consts'
import type { TileF } from '~/core/map/tiles/TileF'
import { BaseTileEffect } from './DefaultTile'

interface FireParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

const particleCache = new WeakMap<TileF, FireParticle[]>()

function pColor(t: number, c1: string, c2: string) {
  return t < 0.5 ? c1 : c2
}

export class FireTile extends BaseTileEffect<TileF> {
  private get isSlow() {
    return this.tile.char === 'f'
  }

  protected render() {
    this.renderParticles()
    this.renderFireText()
  }

  private renderParticles() {
    if (!particleCache.has(this.tile)) {
      particleCache.set(this.tile, [])
    }
    const particles = particleCache.get(this.tile)!

    const spawnChance = this.isSlow ? 0.075 : 0.15
    const speedMultiplier = this.isSlow ? 0.5 : 1.0

    if (particles.length < 6 && Math.random() < spawnChance) {
      const maxLife = (20 + Math.random() * 20) * (this.isSlow ? 1.5 : 1) // 수명 조금 더 길게
      particles.push({
        x: this.centerX + (Math.random() - 0.5) * (CELL_SIZE * 0.6),
        y: this.centerY + 2,
        vx: (Math.random() - 0.5) * 0.4 * speedMultiplier,
        vy: -(0.4 + Math.random() * 0.6) * speedMultiplier,
        life: 1.0,
        maxLife,
        size: (1 + Math.random() * 2) * (this.isSlow ? 0.8 : 1), // 약간 작게
        color: Math.random() > 0.4 ? '#f97316' : '#facc15',
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

  private renderFireText() {
    const { timestamp } = this.context
    const duration = this.isSlow ? 800 : 400
    const progress = (timestamp % duration) / duration

    let scale = 1
    let skewX = 0
    let shadows: [number, number, string][] = []

    if (progress < 0.25) {
      const t = progress / 0.25
      scale = 1 + (1.03 - 1) * t
      skewX = 0 + (-2 - 0) * t
      shadows = [
        [-2 - t, 4 + 2 * t, '#facc15'],
        [-4 - 2 * t, 10 + 2 * t, '#f97316'],
        [-8 - 2 * t, 20 + 4 * t, pColor(t, '#ef4444', '#dc2626')],
        [0, 4 + t, '#facc15'],
      ]
    } else if (progress < 0.5) {
      const t = (progress - 0.25) / 0.25
      scale = 1.03 + (0.98 - 1.03) * t
      skewX = -2 + (1 - -2) * t
      shadows = [
        [-3 + 2 * t, 6 - 3 * t, '#facc15'],
        [-6 + 3 * t, 12 - 4 * t, '#f97316'],
        [-10 + 4 * t, 24 - 8 * t, pColor(t, '#dc2626', '#ef4444')],
        [0, 5 - 2 * t, '#facc15'],
      ]
    } else if (progress < 0.75) {
      const t = (progress - 0.5) / 0.25
      scale = 0.98 + (1.05 - 0.98) * t
      skewX = 1 + (2 - 1) * t
      shadows = [
        [-1 - 3 * t, 3 + 4 * t, '#facc15'],
        [-3 - 4 * t, 8 + 7 * t, pColor(t, '#f97316', '#ea580c')],
        [-6 - 6 * t, 16 + 12 * t, '#ef4444'],
        [0, 3 + 3 * t, '#facc15'],
      ]
    } else {
      const t = (progress - 0.75) / 0.25
      scale = 1.05 + (1 - 1.05) * t
      skewX = 2 + (0 - 2) * t
      shadows = [
        [-4 + 2 * t, 7 - 3 * t, '#facc15'],
        [-7 + 3 * t, 15 - 5 * t, pColor(t, '#ea580c', '#f97316')],
        [-12 + 4 * t, 28 - 8 * t, '#ef4444'],
        [0, 6 - 2 * t, '#facc15'],
      ]
    }

    this.ctx.save()
    this.ctx.translate(this.centerX, this.centerY + CELL_SIZE / 2)
    this.ctx.transform(scale, 0, Math.tan((skewX * Math.PI) / 180), scale, 0, 0)
    this.ctx.translate(-this.centerX, -(this.centerY + CELL_SIZE / 2))

    this.ctx.font = 'bold 13px D2Coding'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    for (const [sY, blur, color] of shadows) {
      this.ctx.shadowOffsetY = sY
      this.ctx.shadowBlur = blur
      this.ctx.shadowColor = color
      this.ctx.fillStyle = 'rgba(0,0,0,0)'
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)
    }

    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetY = 0
    this.ctx.fillStyle = '#facc15'
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

    this.ctx.restore()
  }
}
