import { CELL_SIZE } from '~/components/game/consts';
import { BaseTileEffect } from './DefaultTile';

interface TileGrass {
  x: number;
  y: number;
  char: string;
}

const grassOffsets = new WeakMap<TileGrass, number>()

function lerp(start: number, end: number, amt: number): number {
  return start + (end - start) * amt
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const num = parseInt(hex.replace('#', ''), 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function lerpColor(c1: string, c2: string, amt: number): string {
  const rgb1 = hexToRgb(c1)
  const rgb2 = hexToRgb(c2)
  const r = Math.round(lerp(rgb1.r, rgb2.r, amt))
  const g = Math.round(lerp(rgb1.g, rgb2.g, amt))
  const b = Math.round(lerp(rgb1.b, rgb2.b, amt))
  return `rgb(${r}, ${g}, ${b})`
}

export class GrassTile extends BaseTileEffect {
  protected render() {
    const { timestamp } = this.context

    if (!grassOffsets.has(this.tile)) {
      grassOffsets.set(this.tile, Math.random() * 2200)
    }
    const offset = grassOffsets.get(this.tile)!

    const duration = 2200
    const progress = ((timestamp + offset) % duration) / duration

    let rotateDeg = 0
    let translateX = 0
    let fillColor = '#34d399'
    let shadowBlur = 2
    let shadowColor = 'rgba(52, 211, 153, 0.4)'

    if (progress < 0.25) {
      const t = progress / 0.25
      rotateDeg = lerp(0, 8, t)
      translateX = lerp(0, 1.5, t)
      fillColor = lerpColor('#34d399', '#a3e635', t)
      shadowBlur = lerp(2, 6, t)
      shadowColor = lerpColor('#34d399', '#a3e635', t)
      shadowColor = shadowColor.replace('rgb', 'rgba').replace(')', `, ${lerp(0.4, 0.8, t)})`)
    } else if (progress < 0.75) {
      const t = (progress - 0.25) / 0.5
      rotateDeg = lerp(8, -8, t)
      translateX = lerp(1.5, -1.5, t)
      fillColor = lerpColor('#a3e635', '#059669', t)
      shadowBlur = lerp(6, 1, t)
      shadowColor = lerpColor('#a3e635', '#059669', t)
      shadowColor = shadowColor.replace('rgb', 'rgba').replace(')', `, ${lerp(0.8, 0.2, t)})`)
    } else {
      const t = (progress - 0.75) / 0.25
      rotateDeg = lerp(-8, 0, t)
      translateX = lerp(-1.5, 0, t)
      fillColor = lerpColor('#059669', '#34d399', t)
      shadowBlur = lerp(1, 2, t)
      shadowColor = lerpColor('#059669', '#34d399', t)
      shadowColor = shadowColor.replace('rgb', 'rgba').replace(')', `, ${lerp(0.2, 0.4, t)})`)
    }

    this.ctx.save()

    const bottomX = this.centerX
    const bottomY = this.pixelY + CELL_SIZE
    
    this.ctx.translate(bottomX + translateX, bottomY)
    this.ctx.rotate((rotateDeg * Math.PI) / 180)
    this.ctx.translate(-bottomX, -bottomY)

    this.ctx.font = '500 14px monospace'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    this.ctx.shadowColor = shadowColor
    this.ctx.shadowBlur = shadowBlur
    this.ctx.fillStyle = fillColor

    this.ctx.fillText(this.tile.char, this.centerX, this.centerY + 3)

    this.ctx.restore()
  }
}