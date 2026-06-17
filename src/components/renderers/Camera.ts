import { CELL_SIZE } from '../game/consts'

export class Camera {
  public viewWidth: number
  public viewHeight: number
  public verticalPad: number
  public zoom: number = 1.0

  private currentX: number = 0
  private currentY: number = 0

  private targetX: number = 0
  private targetY: number = 0

  constructor(viewWidth: number, viewHeight: number, verticalPad: number) {
    this.viewWidth = viewWidth
    this.viewHeight = viewHeight
    this.verticalPad = verticalPad
  }

  public snapTo(playerX: number, playerY: number) {
    const startX = playerX * CELL_SIZE + CELL_SIZE / 2
    const startY = playerY * CELL_SIZE + CELL_SIZE / 2

    this.targetX = startX
    this.targetY = startY
    this.currentX = startX
    this.currentY = startY
  }

  public update(playerX: number, playerY: number, lerpFactor: number = 0.12) {
    this.targetX = playerX * CELL_SIZE + CELL_SIZE / 2
    this.targetY = playerY * CELL_SIZE + CELL_SIZE / 2

    // 현재 위치를 목표 위치 쪽으로 매 프레임 조금씩 가깝게 이동시킵니다.
    this.currentX += (this.targetX - this.currentX) * lerpFactor
    this.currentY += (this.targetY - this.currentY) * lerpFactor
  }

  public apply(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.viewWidth / 2, this.viewHeight / 2 + this.verticalPad)
    ctx.scale(this.zoom, this.zoom)

    const snappedX = Math.round(this.currentX)
    const snappedY = Math.round(this.currentY)

    ctx.translate(-snappedX, -snappedY)
  }

  public isVisible(tileX: number, tileY: number): boolean {
    const tilePixelX = tileX * CELL_SIZE
    const tilePixelY = tileY * CELL_SIZE

    const screenX = this.viewWidth / 2 + (tilePixelX - this.currentX) * this.zoom
    const screenY = this.viewHeight / 2 + this.verticalPad + (tilePixelY - this.currentY) * this.zoom

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
