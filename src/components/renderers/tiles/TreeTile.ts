import { CELL_SIZE } from '~/components/game/consts'
import { NatureTile } from './NatureTile'

const treeOffsets = new WeakMap<any, number>()

function lerp(start: number, end: number, amt: number): number {
  return start + (end - start) * amt
}

export class TreeTile extends NatureTile {
  protected render() {
    const { timestamp } = this.context

    if (!treeOffsets.has(this.tile)) {
      treeOffsets.set(this.tile, Math.random() * 5000)
    }

    const leafOffset = treeOffsets.get(this.tile)!
    const grassOffset = this.getGrassOffset()

    this.drawSwayingGrass(timestamp, grassOffset)

    this.ctx.save()
    this.ctx.font = '800 14px D2Coding'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillStyle = '#16a34a'
    this.ctx.shadowColor = 'rgba(22, 163, 74, 0.4)'
    this.ctx.shadowBlur = 3
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY + 5)
    this.ctx.restore()

    this.drawFallingLeaf(timestamp, leafOffset)
  }

  private drawFallingLeaf(timestamp: number, leafOffset: number) {
    const size = CELL_SIZE
    const leafDuration = 4000
    const progress = ((timestamp + leafOffset) % leafDuration) / leafDuration

    const startY = this.pixelY + size * 0.3
    const endY = this.pixelY + size
    const y = lerp(startY, endY, progress)

    const startX = this.centerX + (Math.sin(leafOffset) * size * 0.15)
    const sway = Math.sin(progress * Math.PI * 3) * (size * 0.2)
    const x = startX + sway

    const alpha = progress < 0.8 ? 1 : lerp(1, 0, (progress - 0.8) / 0.2)

    this.ctx.save()
    this.ctx.globalAlpha = alpha
    this.ctx.fillStyle = '#22c55e'
    
    this.ctx.translate(x, y)
    this.ctx.rotate(progress * Math.PI * 4)

    this.ctx.beginPath()
    this.ctx.ellipse(0, 0, 1.5, 3, 0, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.restore()
  }
}