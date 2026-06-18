import { CELL_SIZE } from '../game/consts'

const activeCache = new Map<string, { startTime: number, particles: any[] }>()
const finishedSet = new Set<string>()

export const EffectRenderer = {
  reset() {
    activeCache.clear()
    finishedSet.clear()
  },

  drawWetOverlay(ctx: CanvasRenderingContext2D, gridX: number, gridY: number, timestamp: number, size: number = CELL_SIZE) {
    ctx.save()

    const lx = gridX * size
    const ty = gridY * size

    const xOffset = 0
    const yOffset = 5

    const cx = lx + size / 2 + xOffset
    const cy = ty + size / 2 + yOffset

    const duration = 5000
    const rippleTimes = [(timestamp % duration) / duration, ((timestamp + duration / 2) % duration) / duration]

    const maxRadius = size * 0.45

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)'
    ctx.shadowColor = 'rgba(34, 211, 238, 0.2)'
    ctx.shadowBlur = 4

    rippleTimes.forEach((progress) => {
      ctx.save()
      ctx.globalAlpha = 1 - progress
      ctx.lineWidth = (1 - progress) * 1.5

      const rx = maxRadius * progress
      const ry = maxRadius * 0.28 * progress

      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    })

    ctx.save()

    const iconSize = 10
    const iconX = lx + size - iconSize - 2
    const iconY = ty + 2

    const pulseAlpha = 0.6 + Math.sin(timestamp * 0.005) * 0.4
    ctx.globalAlpha = pulseAlpha

    ctx.fillStyle = '#22d3ee' // text-cyan-400
    ctx.shadowColor = 'rgba(34, 211, 238, 0.8)'
    ctx.shadowBlur = 3

    ctx.translate(iconX, iconY)
    ctx.scale(iconSize / 24, iconSize / 24)
    
    const dropPath = new Path2D('M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z')
    ctx.fill(dropPath)

    ctx.restore()

    ctx.restore()
  },

  drawElectricOverlay(
    ctx: CanvasRenderingContext2D,
    gridX: number,
    gridY: number,
    timestamp: number,
    isWet: boolean,
    size: number = CELL_SIZE
  ) {
    ctx.save()

    const lx = gridX * size
    const ty = gridY * size

    let bgColor = 'rgba(234, 179, 8, 0.2)' // bg-yellow-500/20
    let borderColor = 'rgba(250, 204, 21, 0.4)' // border-yellow-400/40
    let glowColor = 'rgba(234, 179, 8, 0.5)' // drop-shadow
    let glowBlur = 5
    let textColor = '#facc15' // text-yellow-400

    if (isWet) {
      bgColor = 'rgba(251, 191, 36, 0.4)' // bg-amber-400/40
      borderColor = 'rgba(252, 211, 77, 0.6)' // border-amber-300/60
      glowColor = 'rgba(251, 191, 36, 0.8)'
      glowBlur = 8
      textColor = '#fcd34d' // text-amber-300
    }

    const flashAlpha = 0.6 + Math.sin(timestamp * 0.02) * 0.2
    ctx.globalAlpha = flashAlpha * 0.8 // 기본 opacity-80 반영

    ctx.fillStyle = bgColor
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 2 // border-2

    ctx.shadowColor = glowColor
    ctx.shadowBlur = glowBlur

    ctx.fillRect(lx, ty, size, size)
    ctx.strokeRect(lx + 1, ty + 1, size - 2, size - 2)

    ctx.shadowBlur = 0 // 그림자 초기화
    ctx.globalAlpha = 1.0

    const bounceY = Math.abs(Math.sin(timestamp * 0.006)) * 4

    ctx.fillStyle = textColor
    ctx.save()
    const iconSize = 14
    ctx.translate(lx + 2, ty + 2 - bounceY)
    ctx.scale(iconSize / 24, iconSize / 24)

    const lightningPath = new Path2D('M13 2v9h5l-7 11v-9H6z')
    ctx.fill(lightningPath)
    ctx.restore()

    ctx.restore()
  },

  drawMonsterDeath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    timestamp: number,
    size: number = CELL_SIZE
  ) {
    const key = `${x},${y}`

    if (finishedSet.has(key)) return

    if (!activeCache.has(key)) {
      const cx = x * size + size / 2
      const cy = y * size + size / 2
      const particles = Array.from({ length: 8 }, () => ({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.4 - 0.2,
        alpha: 1,
        size: 2 + Math.random() * 2
      }))
      
      activeCache.set(key, { startTime: timestamp, particles })
    }

    const state = activeCache.get(key)!
    const elapsed = timestamp - state.startTime
    const duration = 600

    ctx.save()
    state.particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy + 0.05
      p.alpha = 1 - (elapsed / duration)
      
      if (p.alpha > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha})`
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
    })
    ctx.restore()

    if (elapsed > duration) {
      activeCache.delete(key)
      finishedSet.add(key)
    }
  }
}