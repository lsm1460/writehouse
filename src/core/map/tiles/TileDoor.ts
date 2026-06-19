import { CARDINAL_DIRECTIONS, DIAGONAL_DIRECTIONS } from '~/core/consts'
import type { EngineContext } from '~/core/engineContext'
import type { GridType } from '~/core/types'
import { createTile } from '.'
import { Tile } from '../Tile'
import { EnergyTile } from './EnergyTile'
import { Tile1 } from './Tile1'

type SlideType = 'HORIZONTAL' | 'VERTICAL'

export class TileDoor extends Tile {
  private originX: number
  private originY: number
  private readonly slideType: SlideType

  constructor(char: string, x: number, y: number) {
    super(char, x, y)
    this.originX = x
    this.originY = y
    this.slideType = char === '⎴' ? 'HORIZONTAL' : 'VERTICAL'
  }

  override getData() {
    return {
      originX: this.originX,
      originY: this.originY,
    }
  }

  override setData(data: any) {
    if (data && typeof data.originX === 'number') this.originX = data.originX
    if (data && typeof data.originY === 'number') this.originY = data.originY
  }

  override get lightRadius() {
    return 0
  }

  public updateDoorState(grid: GridType, ctx: EngineContext): boolean {
    const isMoved = this.x !== this.originX || this.y !== this.originY
    
    if (isMoved) {
      return this.handleOpenState(grid, ctx)
    } else {
      return this.handleClosedState(grid, ctx)
    }
  }

  private handleOpenState(grid: GridType, ctx: EngineContext): boolean {
    if (this.hasCardinalElectricity(grid)) {
      return false
    }
    return this.tryReturnToOrigin(grid, ctx)
  }

  private handleClosedState(grid: GridType, ctx: EngineContext): boolean {
    for (const [ddx, ddy] of DIAGONAL_DIRECTIONS) {
      const diagX = this.x + ddx
      const diagY = this.y + ddy

      if (!this.isValidCoords(grid, diagX, diagY)) continue

      if (this.checkIsElectrified(grid[diagY][diagX])) {
        const { destX, destY } = this.calculateDestCoords(ddx, ddy)

        if (this.canMoveTo(grid, ctx, destX, destY)) {
          this.moveTile(grid, destX, destY)
          return true
        }
      }
    }
    return false
  }

  private hasCardinalElectricity(grid: GridType): boolean {
    return CARDINAL_DIRECTIONS.some(([dx, dy]) => {
      const nx = this.x + dx
      const ny = this.y + dy
      return this.isValidCoords(grid, nx, ny) && this.checkIsElectrified(grid[ny][nx])
    })
  }

  private calculateDestCoords(ddx: number, ddy: number): { destX: number; destY: number } {
    return {
      destX: this.slideType === 'HORIZONTAL' ? this.x + ddx : this.x,
      destY: this.slideType === 'VERTICAL' ? this.y + ddy : this.y,
    }
  }

  private canMoveTo(grid: GridType, ctx: EngineContext, destX: number, destY: number): boolean {
    return (
      this.isValidCoords(grid, destX, destY) &&
      grid[destY][destX].char === ' ' &&
      !ctx.map.isPlayerAt(destX, destY) &&
      !ctx.map.isTileOccupiedByEntity(destX, destY)
    )
  }

  private tryReturnToOrigin(grid: GridType, ctx: EngineContext): boolean {
    if (
      grid[this.originY][this.originX].char === ' ' &&
      !ctx.map.isPlayerAt(this.originX, this.originY) &&
      !ctx.map.isTileOccupiedByEntity(this.originX, this.originY)
    ) {
      this.moveTile(grid, this.originX, this.originY)
      return true
    }
    return false
  }

  private moveTile(grid: GridType, destX: number, destY: number): void {
    grid[this.y][this.x] = createTile(' ', this.x, this.y)
    this.x = destX
    this.y = destY
    grid[destY][destX] = this
  }

  private isValidCoords(grid: GridType, x: number, y: number): boolean {
    return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length
  }

  private checkIsElectrified(tile: Tile): boolean {
    if (!tile) return false
    
    return (tile as EnergyTile).hasEnergy
  }
}
