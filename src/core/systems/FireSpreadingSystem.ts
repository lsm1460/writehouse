import type { EngineContext } from '../engineContext'
import type { GridType } from '~/core/types'
import { COMPASS_DIRECTIONS } from '~/core/consts'
import { isOutOfBounds } from '~/core/utils/grid'
import { TileA } from '../map/tiles/TileA'
import { TileF } from '../map/tiles/TileF'
import { WalkableTile } from '../map/tiles/types'

export class FireSpreadingSystem {
  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public update(deltaTime: number, grid: GridType): boolean {
    let changed = false
    const spreadSources: { x: number; y: number }[] = []

    // 1. 맵 전체를 순회하며 불의 상태 업데이트 및 이번 턴에 번질 발화점 수집
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]

        if (tile instanceof TileA) {
          spreadSources.push({ x, y })
          continue
        }

        if (tile instanceof TileF) {
          if (tile.fireStage === 'EXTINGUISHED') continue

          if (tile.isInitialTurn) {
            tile.isInitialTurn = false
            continue
          }

          if (this.checkAdjacentOil(x, y, grid)) {
            if (tile.fireStage === 'WEAK') {
              tile.reignite()
              changed = true
            }
          } else {
            tile.age += deltaTime
            if (tile.age >= tile.FIRE_LIFETIME) {
              tile.degrade()
              changed = true
              continue 
            }
          }

          spreadSources.push({ x, y })
        }
      }
    }

    for (const source of spreadSources) {
      if (this.spreadFire(source.x, source.y, grid)) {
        changed = true
      }
    }

    return changed
  }

  private spreadFire(x: number, y: number, grid: GridType): boolean {
    let spreadSuccess = false

    for (const [dx, dy] of COMPASS_DIRECTIONS) {
      const nx = x + dx
      const ny = y + dy

      if (isOutOfBounds(nx, ny, grid)) continue

      const targetTile = grid[ny][nx]

      if (targetTile instanceof WalkableTile) {
        const wasWet = targetTile.isWet
        targetTile.dry()

        if (wasWet) {
          spreadSuccess = true
          continue
        }
      }

      if (targetTile.char === 'T' || targetTile.char === 'g') {
        grid[ny][nx] = this.createSpreadFireTile(targetTile.char, nx, ny)
        spreadSuccess = true
      }
    }

    return spreadSuccess
  }

  private checkAdjacentOil(x: number, y: number, grid: GridType): boolean {
    return COMPASS_DIRECTIONS.some(([dx, dy]) => {
      const nx = x + dx
      const ny = y + dy
      return !isOutOfBounds(nx, ny, grid) && grid[ny][nx].char === 'O'
    })
  }

  private createSpreadFireTile(targetChar: string, x: number, y: number): TileF {
    const isTree = targetChar === 'T'
    const stage = isTree ? 'STRONG' : 'WEAK'
    const char = isTree ? 'F' : 'f'

    const newFire = new TileF(char, x, y)
    newFire.fireStage = stage
    return newFire
  }
}