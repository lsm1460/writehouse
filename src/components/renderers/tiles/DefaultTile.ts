import { CELL_SIZE } from '~/components/game/consts';
import type { Tile } from '~/core/map/Tile';
import type { LightState } from '~/core/types';

export interface RenderContext {
  stageClear: boolean;
  timestamp: number;
  lightState: LightState
}

export abstract class BaseTileEffect<T extends Tile = Tile> {
  protected ctx!: CanvasRenderingContext2D
  protected tile!: T
  protected context!: RenderContext

  public draw(ctx: CanvasRenderingContext2D, tile: T, renderContext: RenderContext) {
    this.ctx = ctx
    this.tile = tile
    this.context = renderContext

    this.ctx.save()
    this.render()
    this.ctx.restore()
  }

  protected abstract render(): void

  protected get pixelX() { return this.tile.x * CELL_SIZE }
  protected get pixelY() { return this.tile.y * CELL_SIZE }
  protected get centerX() { return this.pixelX + CELL_SIZE / 2 }
  protected get centerY() { return this.pixelY + CELL_SIZE / 2 }
}

export class DefaultTile extends BaseTileEffect<any> {
  protected render() {
    this.ctx.fillStyle = '#a1a1aa'
    this.ctx.font = 'bold 14px monospace'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    
    this.ctx.fillText(this.tile.char, this.centerX, this.centerY)
  }
}