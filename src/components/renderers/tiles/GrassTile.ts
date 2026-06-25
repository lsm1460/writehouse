import { NatureTile } from './NatureTile'

export class GrassTile extends NatureTile {
  protected render() {
    const { timestamp } = this.context
    const offset = this.getGrassOffset()

    this.ctx.save()
    this.ctx.font = '500 14px D2Coding'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillStyle = '#4ade80'
    this.ctx.shadowBlur = 0
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY + 3)
    this.ctx.restore()

    this.drawSwayingGrass(timestamp, offset)
  }
}