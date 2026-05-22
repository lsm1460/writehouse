import { CARDINAL_DIRECTIONS } from '~/core/consts'
import type { GridType } from '~/core/types'
import { createTile } from '.'
import { Tile } from '../Tile'

interface WaterChange {
  x: number
  y: number
  char: string
}

export class TileW extends Tile {
  private spreadTimer: number = 0
  private readonly SPREAD_INTERVAL: number = 0

  constructor(char: string, x: number, y: number) {
    super(char, x, y)
  }

  get isWalkable(): boolean {
    return true
  }

  public onEnvironmentUpdate(deltaTime: number, mapGrid: GridType): boolean {
    if (this._char === 'w') {
      return false
    }

    this.spreadTimer += deltaTime
    if (this.spreadTimer >= this.SPREAD_INTERVAL) {
      this.spreadTimer = 0
      return this.spreadWater(mapGrid)
    }

    return false
  }

  private spreadWater(mapGrid: GridType): boolean {
    const targetsToUpdate = this.findSpreadTargets(mapGrid)

    if (targetsToUpdate.length === 0) {
      return false
    }

    this.applyTileChanges(mapGrid, targetsToUpdate)
    this.demoteToShallowWater(mapGrid)

    return true
  }

  private findSpreadTargets(mapGrid: GridType): WaterChange[] {
    const queue: [number, number][] = [[this.x, this.y]]
    const visited = new Set<string>([`${this.x},${this.y}`])
    const targetsToUpdate: WaterChange[] = []

    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!

      for (const d of CARDINAL_DIRECTIONS) {
        const nx = cx + d[0]
        const ny = cy + d[1]
        const key = `${nx},${ny}`

        if (this.isOutOfBounds(nx, ny, mapGrid) || visited.has(key)) {
          continue
        }

        const targetTile = mapGrid[ny][nx]

        if (targetTile.char === 'w') {
          visited.add(key)
          queue.push([nx, ny])
        } else if (this.canExtinguishFire(targetTile)) {
          visited.add(key)
          targetsToUpdate.push({ x: nx, y: ny, char: ' ' })
        } else if (this.canFlowInto(targetTile)) {
          visited.add(key)
          targetsToUpdate.push({ x: nx, y: ny, char: 'w' })
        }
      }
    }

    return targetsToUpdate
  }

  private isOutOfBounds(x: number, y: number, mapGrid: GridType): boolean {
    return y < 0 || y >= mapGrid.length || x < 0 || x >= mapGrid[y].length
  }

  private canExtinguishFire(tile: Tile): boolean {
    return tile.char === 'F' || tile.char === 'f'
  }

  private canFlowInto(tile: Tile): boolean {
    return tile.isWalkable && tile.char !== 'W'
  }

  private applyTileChanges(mapGrid: GridType, changes: WaterChange[]): void {
    changes.forEach((target) => {
      mapGrid[target.y][target.x] = createTile(target.char, target.x, target.y)
    })
  }

  private demoteToShallowWater(mapGrid: GridType): void {
    mapGrid[this.y][this.x] = createTile('w', this.x, this.y)
  }
}