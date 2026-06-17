import { CELL_SIZE } from "~/components/game/consts"
import type { TileEffect } from "./DefaultTile"

export const LightTile: TileEffect = {
  render(ctx, x, y, char, timestamp) {
    const tilePixelX = x * CELL_SIZE
    const tilePixelY = y * CELL_SIZE
    const centerX = tilePixelX + CELL_SIZE / 2
    const centerY = tilePixelY + CELL_SIZE / 2

    const pulse = 0.75 + Math.sin(timestamp * 0.003) * 0.25

    ctx.save()
    ctx.globalAlpha = pulse

    ctx.font = '900 14px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const glowLayers: [number, string][] = [
      [20, 'rgba(234, 179, 8, 0.4)'], 
      [12, '#eab308'],                
      [4, '#facc15']                  
    ]

    for (const [blur, color] of glowLayers) {
      ctx.shadowColor = color
      ctx.shadowBlur = blur
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      
      ctx.fillStyle = '#facc15'
      ctx.fillText(char, centerX, centerY)
    }

    ctx.shadowBlur = 0
    ctx.fillStyle = '#facc15'
    ctx.fillText(char, centerX, centerY)

    ctx.restore()
  }
}