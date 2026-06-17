import { CELL_SIZE } from "~/components/game/consts"
import type { LightState } from "~/core/types"

export interface TileEffect {
  render(ctx: CanvasRenderingContext2D, x: number, y: number, char: string, timestamp: number, lightState: LightState): void
}

export const DefaultTile: TileEffect = {
  render(ctx, x, y, char) {
    const tilePixelX = x * CELL_SIZE
    const tilePixelY = y * CELL_SIZE

    ctx.fillStyle = '#a1a1aa'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(char, tilePixelX + CELL_SIZE / 2, tilePixelY + CELL_SIZE / 2)
  }
}