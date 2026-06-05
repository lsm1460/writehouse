import { COMPASS_DIRECTIONS } from '~/core/consts'
import type { GridType } from '~/core/types'
import { isOutOfBounds } from '~/core/utils/grid'
import type { EngineContext } from '../engineContext'
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
    const fireSources: { x: number; y: number }[] = []

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]
        if (
          tile instanceof TileA ||
          (tile instanceof TileF && tile.fireStage !== 'EXTINGUISHED' && !tile.isInitialTurn)
        ) {
          fireSources.push({ x, y })
        }
      }
    }

    for (const source of fireSources) {
      if (this.spreadFire(source.x, source.y, grid)) changed = true
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

  private createSpreadFireTile(targetChar: string, x: number, y: number): TileF {
    const isTree = targetChar === 'T'
    return new TileF(isTree ? 'F' : 'f', x, y)
  }
}
