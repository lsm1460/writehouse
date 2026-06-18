import { CELL_SIZE } from '~/components/game/consts'
import { BaseTileEffect } from './DefaultTile'

const GRASS_WIDTH_SCALE = 0.75
const GRASS_HEIGHT_SCALE = 0.2
const GRASS_DURATION = 2200     // 바람에 흔들리는 주기 (ms)

const grassOffsets = new WeakMap<any, number>()

function lerp(start: number, end: number, amt: number): number {
  return start + (end - start) * amt
}

export abstract class NatureTile extends BaseTileEffect {
  protected getGrassOffset(): number {
    if (!grassOffsets.has(this.tile)) {
      grassOffsets.set(this.tile, Math.random() * GRASS_DURATION)
    }
    return grassOffsets.get(this.tile)!
  }

  protected drawSwayingGrass(timestamp: number, offset: number) {
    const progress = ((timestamp + offset) % GRASS_DURATION) / GRASS_DURATION

    let rotateDeg = 0
    let translateX = 0

    if (progress < 0.25) {
      const t = progress / 0.25
      rotateDeg = lerp(0, 3, t)
      translateX = lerp(0, 0.5, t)
    } else if (progress < 0.75) {
      const t = (progress - 0.25) / 0.5
      rotateDeg = lerp(3, -3, t)
      translateX = lerp(0.5, -0.5, t)
    } else {
      const t = (progress - 0.75) / 0.25
      rotateDeg = lerp(-3, 0, t)
      translateX = lerp(-0.5, 0, t)
    }

    const bottomY = this.pixelY + CELL_SIZE

    this.ctx.save()
    this.ctx.translate(this.centerX + translateX, bottomY)
    this.ctx.rotate((rotateDeg * Math.PI) / 180)
    
    // 상단에 선언한 상수를 받아와 스케일을 독립적으로 조절합니다.
    this.ctx.scale(GRASS_WIDTH_SCALE, GRASS_HEIGHT_SCALE)
    this.ctx.translate(-this.centerX, -bottomY)

    this.ctx.shadowColor = 'rgba(34, 197, 94, 0.3)'
    this.ctx.shadowBlur = 2
    this.ctx.fillStyle = '#22c55e'

    this.ctx.beginPath()
    this.ctx.moveTo(this.centerX - 11, bottomY)
    this.ctx.quadraticCurveTo(this.centerX - 12, bottomY - 4, this.centerX - 13, bottomY - 7)
    this.ctx.quadraticCurveTo(this.centerX - 10, bottomY - 3, this.centerX - 9, bottomY)

    this.ctx.moveTo(this.centerX - 8, bottomY)
    this.ctx.quadraticCurveTo(this.centerX - 9, bottomY - 6, this.centerX - 10, bottomY - 11)
    this.ctx.quadraticCurveTo(this.centerX - 7, bottomY - 5, this.centerX - 6, bottomY)

    this.ctx.moveTo(this.centerX - 5, bottomY)
    this.ctx.quadraticCurveTo(this.centerX - 6, bottomY - 9, this.centerX - 6, bottomY - 14)
    this.ctx.quadraticCurveTo(this.centerX - 4, bottomY - 7, this.centerX - 3, bottomY)

    this.ctx.moveTo(this.centerX - 2, bottomY)
    this.ctx.quadraticCurveTo(this.centerX - 2, bottomY - 11, this.centerX - 1, bottomY - 17)
    this.ctx.quadraticCurveTo(this.centerX, bottomY - 8, this.centerX, bottomY)

    this.ctx.moveTo(this.centerX + 1, bottomY)
    this.ctx.quadraticCurveTo(this.centerX + 1, bottomY - 10, this.centerX + 2, bottomY - 16)
    this.ctx.quadraticCurveTo(this.centerX + 3, bottomY - 7, this.centerX + 3, bottomY)

    this.ctx.moveTo(this.centerX + 4, bottomY)
    this.ctx.quadraticCurveTo(this.centerX + 5, bottomY - 8, this.centerX + 6, bottomY - 13)
    this.ctx.quadraticCurveTo(this.centerX + 6, bottomY - 6, this.centerX + 7, bottomY)

    this.ctx.moveTo(this.centerX + 7, bottomY)
    this.ctx.quadraticCurveTo(this.centerX + 8, bottomY - 6, this.centerX + 9, bottomY - 10)
    this.ctx.quadraticCurveTo(this.centerX + 9, bottomY - 4, this.centerX + 10, bottomY)

    this.ctx.moveTo(this.centerX + 10, bottomY)
    this.ctx.quadraticCurveTo(this.centerX + 11, bottomY - 4, this.centerX + 12, bottomY - 6)
    this.ctx.quadraticCurveTo(this.centerX + 11, bottomY - 3, this.centerX + 11, bottomY)
    this.ctx.fill()

    this.ctx.restore()
  }
}