import type { TileL } from "~/core/map/tiles/TileL"
import { BaseTileEffect } from "./DefaultTile"

export class LightTile extends BaseTileEffect<TileL> {
  protected render() {
    const { timestamp } = this.context

    const pulse = 0.75 + Math.sin(timestamp * 0.003) * 0.25
    
    this.ctx.save()
    this.ctx.globalAlpha = pulse

    this.ctx.font = '900 14px D2Coding'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    const glowLayers: [number, string][] = [
      [20, 'rgba(234, 179, 8, 0.4)'], 
      [12, '#eab308'],                
      [4, '#facc15']                  
    ]

    for (const [blur, color] of glowLayers) {
      this.ctx.shadowColor = color
      this.ctx.shadowBlur = blur
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
      
      this.ctx.fillStyle = '#facc15'
      this.ctx.fillText(this.tile.char, this.centerX, this.centerY)
    }

    this.ctx.shadowBlur = 0
    this.ctx.fillStyle = '#facc15'
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY)

    this.ctx.restore()
  }
}