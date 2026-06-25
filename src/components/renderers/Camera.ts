import { CELL_SIZE } from '../game/consts'

interface ZoomOptions {
  animate?: boolean
  lerpFactor?: number
}

interface OffsetOptions {
  duration?: number
}

export class Camera {
  public viewWidth: number
  public viewHeight: number
  public verticalPad: number
  public zoom: number = 1.5

  private targetZoom: number = 1.5

  private currentX: number = 0
  private currentY: number = 0
  private targetX: number = 0
  private targetY: number = 0

  private offsetY: number = 0
  private targetOffsetY: number = 0
  private startOffsetY: number = 0
  private offsetStartTime: number | null = null
  private offsetDuration: number = 0

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

    this.currentX += (this.targetX - this.currentX) * lerpFactor
    this.currentY += (this.targetY - this.currentY) * lerpFactor

    if (this.offsetStartTime !== null && this.offsetDuration > 0) {
      const elapsed = performance.now() - this.offsetStartTime
      const progress = Math.min(elapsed / this.offsetDuration, 1)

      this.offsetY = this.startOffsetY + (this.targetOffsetY - this.startOffsetY) * progress

      if (progress >= 1) {
        this.offsetStartTime = null
      }
    } else {
      this.offsetY += (this.targetOffsetY - this.offsetY) * 0.03
    }

    if (Math.abs(this.targetZoom - this.zoom) > 0.001) {
      this.zoom += (this.targetZoom - this.zoom) * 0.08
    } else {
      this.zoom = this.targetZoom
    }
  }

  public apply(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.viewWidth / 2, this.viewHeight / 2 + this.verticalPad)
    ctx.scale(this.zoom, this.zoom)

    const snappedX = Math.round(this.currentX)
    const snappedY = Math.round(this.currentY + this.offsetY)

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

  public setCameraYOffset(y: number, options?: OffsetOptions) {
    this.targetOffsetY = y
    this.startOffsetY = this.offsetY

    if (options?.duration && options.duration > 0) {
      this.offsetStartTime = performance.now()
      this.offsetDuration = options.duration
    } else {
      this.offsetStartTime = null
      this.offsetDuration = 0
    }
  }

  public resetOffset() {
    this.offsetY = 0
    this.targetOffsetY = 0
    this.startOffsetY = 0
    this.offsetStartTime = null
    this.offsetDuration = 0
  }

  public setZoom(value: number | ((prevZoom: number) => number), options?: ZoomOptions) {
    const nextZoom = typeof value === 'function' ? value(this.targetZoom) : value

    const clampedZoom = Math.max(0.5, Math.min(nextZoom, 6.0))

    if (options?.animate) {
      this.targetZoom = clampedZoom
    } else {
      this.targetZoom = clampedZoom
      this.zoom = clampedZoom
    }
  }
}
