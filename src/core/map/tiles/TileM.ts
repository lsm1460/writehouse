import { Tile } from '../Tile'
import { isOutOfBounds } from '~/core/utils/grid'
import { type IMonsterTile } from './types'

export class TileM extends Tile implements IMonsterTile {
  public direction: 'RIGHT' | 'LEFT' = 'RIGHT'
  public lastX = 0
  public lastY = 0

  renderX = 0
  renderY = 0
  moveStartTime = 0
  
  constructor(x: number, y: number) {
    super('M', x, y)
    this.lastX = x
    this.lastY = y
  }

  override getData() {
    return {
      direction: this.direction,
    }
  }

  override setData(data: any) {
    if (data && typeof data.direction === 'string') {
      this.direction = data.direction as 'RIGHT' | 'LEFT'
    }
  }

  public getNextPosition(grid: any[][], entities: any[][]): { nx: number; ny: number } {
    let dx = this.direction === 'RIGHT' ? 1 : -1
    let nx = this.x + dx
    let ny = this.y

    const isBlocked = (tx: number, ty: number) => {
      if (isOutOfBounds(tx, ty, grid)) return true
      if (!grid[ty][tx].isWalkable) return true
      if (entities[ty][tx] !== null) return true
      return false
    }

    if (isBlocked(nx, ny)) {
      this.direction = this.direction === 'RIGHT' ? 'LEFT' : 'RIGHT'
      dx = this.direction === 'RIGHT' ? 1 : -1
      nx = this.x + dx

      if (isBlocked(nx, ny)) {
        return { nx: this.x, ny: this.y }
      }
    }

    return { nx, ny }
  }

  public updatePosition(nx: number, ny: number): void {
    this.lastX = this.x
    this.lastY = this.y
    this.x = nx
    this.y = ny
  }

  public stayQuiet(): void {
    this.lastX = this.x
    this.lastY = this.y
  }

  public onEnvironmentUpdate(): boolean {
    return false
  }
}
