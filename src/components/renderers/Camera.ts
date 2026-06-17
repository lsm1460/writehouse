import { CELL_SIZE } from "../game/consts"

export class Camera {
  public viewWidth: number
  public viewHeight: number
  public verticalPad: number
  public zoom: number = 1.0

  private targetX: number = 0
  private targetY: number = 0

  constructor(viewWidth: number, viewHeight: number, verticalPad: number) {
    this.viewWidth = viewWidth
    this.viewHeight = viewHeight
    this.verticalPad = verticalPad
  }

  public update(playerX: number, playerY: number) {
    this.targetX = playerX * CELL_SIZE + CELL_SIZE / 2
    this.targetY = playerY * CELL_SIZE + CELL_SIZE / 2
  }

  public apply(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.viewWidth / 2, this.viewHeight / 2 + this.verticalPad)
    
    ctx.scale(this.zoom, this.zoom)
    
    ctx.translate(-this.targetX, -this.targetY)
  }

  public isVisible(tileX: number, tileY: number): boolean {
    const tilePixelX = tileX * CELL_SIZE
    const tilePixelY = tileY * CELL_SIZE

    const screenX = this.viewWidth / 2 + (tilePixelX - this.targetX) * this.zoom
    const screenY = (this.viewHeight / 2 + this.verticalPad) + (tilePixelY - this.targetY) * this.zoom

    const scaledCellSize = CELL_SIZE * this.zoom

    return (
      screenX >= -scaledCellSize &&
      screenX <= this.viewWidth + scaledCellSize &&
      screenY >= -scaledCellSize &&
      screenY <= this.viewHeight + scaledCellSize
    )
  }

  public setZoom(value: number) {
    this.zoom = Math.max(0.5, Math.min(value, 3.0))
  }
}