import { COMPASS_DIRECTIONS } from '~/core/consts'
import type { GridType } from '~/core/types'
import { isOutOfBounds } from '~/core/utils/grid'
import { PushTile } from './PushTile'
import { TileF } from './TileF'
import { type IEnvironmentTile, WalkableTile } from './types'

export class TileA extends PushTile implements IEnvironmentTile {
  constructor(x: number, y: number) {
    super('A', x, y)
  }

  override get lightRadius() {
    return 1
  }

  public onEnvironmentUpdate(deltaTime: number, grid: GridType): boolean {
    let hasChanged = false

    const spreadSuccess = this.spreadFire(grid)

    return hasChanged || spreadSuccess
  }

  private spreadFire(grid: GridType): boolean {
    let spreadSuccess = false

    for (const [dx, dy] of COMPASS_DIRECTIONS) {
      const nx = this.x + dx
      const ny = this.y + dy

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
    const stage = isTree ? 'STRONG' : 'WEAK'
    const char = isTree ? 'F' : 'f'

    const newFire = new TileF(char, x, y)
    newFire.fireStage = stage
    return newFire
  }
}
