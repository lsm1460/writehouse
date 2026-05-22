import { CARDINAL_DIRECTIONS } from '~/core/consts'
import type { GridType } from '~/core/types'
import { isOutOfBounds } from '~/core/utils/grid'
import { createTile } from '.'
import { Tile } from '../Tile'
import { WalkableTile } from './types'

interface WaterChange {
  x: number
  y: number
  type: 'REPLACE' | 'WET'
  char: string
}

export class TileW extends Tile {
  isWet = true
   
  private spreadTimer: number = 0
  private readonly SPREAD_INTERVAL: number = 0

  constructor(char: string, x: number, y: number) {
    super(char, x, y)
  }

  override get isWalkable(): boolean {
    return true
  }

  public onEnvironmentUpdate(deltaTime: number, mapGrid: GridType): boolean {
    console.log(1)
    if (this._char === 'w') {
      console.log(2)
      return false
    }
    
    console.log(3)
    this.spreadTimer += deltaTime
    if (this.spreadTimer >= this.SPREAD_INTERVAL) {
      console.log(4)
      this.spreadTimer = 0
      return this.spreadWater(mapGrid)
    }
    
    console.log(5)
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

        if (isOutOfBounds(nx, ny, mapGrid) || visited.has(key)) {
          continue
        }

        const targetTile = mapGrid[ny][nx]

        if (targetTile.char === 'w') {
          visited.add(key)
          queue.push([nx, ny])
        } else if (this.canExtinguishFire(targetTile)) {
          visited.add(key)
          targetsToUpdate.push({ x: nx, y: ny, type: 'REPLACE', char: ' ' })
        } else if (this.canFlowInto(targetTile)) {
          visited.add(key)

          if (targetTile.char.trim() === '') {
            targetsToUpdate.push({ x: nx, y: ny, type: 'REPLACE', char: 'w' })
          } else {
            targetsToUpdate.push({ x: nx, y: ny, type: 'WET', char: targetTile.char })
          }
        }
      }
    }

    return targetsToUpdate
  }

  private canExtinguishFire(tile: Tile): boolean {
    return tile.char === 'F' || tile.char === 'f'
  }

  private canFlowInto(tile: Tile): boolean {
    return tile.char !== 'W' && tile instanceof WalkableTile
  }

  private applyTileChanges(mapGrid: GridType, changes: WaterChange[]): void {
    changes.forEach((target) => {
      const currentTile = mapGrid[target.y][target.x]

      if (target.type === 'REPLACE') {
        mapGrid[target.y][target.x] = createTile(target.char, target.x, target.y)
      } else if (target.type === 'WET') {
        if (currentTile instanceof WalkableTile) {
          currentTile.wet()
        }
      }
    })
  }

  private demoteToShallowWater(mapGrid: GridType): void {
    mapGrid[this.y][this.x] = createTile('w', this.x, this.y)
  }
}
