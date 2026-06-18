import type { GridType } from '~/core/types'
import type { EngineContext } from '../engineContext'
import { EnergyTile } from '../map/tiles/EnergyTile'
import type { TileD } from '../map/tiles/TileD'
import { TileWPT } from '../map/tiles/TileWPT'

export class ElectricitySystem {
  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public reset(grid: GridType): void {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]
        if ('isElectric' in tile && (tile as any).isElectric) {
          ;(tile as any).resetPower()
        } else if (typeof (tile as any).discharge === 'function') {
          ;(tile as any).discharge()
        }
      }
    }
  }

  public update(): boolean {
    const grid = this.ctx.map.grid

    let keepUpdating = true
    let anyTurnChanged = false
    let safetyCounter = 0

    while (keepUpdating && safetyCounter < 100) {
      const changedInThisLoop = this.calculatePropagation(grid)

      if (changedInThisLoop) {
        anyTurnChanged = true
      }

      keepUpdating = changedInThisLoop
      safetyCounter++
    }

    return anyTurnChanged
  }

  private calculatePropagation(grid: GridType): boolean {
    const entities = this.ctx.map.entities
    let changed = false

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]

        // 1. 일반 발전 타일 전파
        if (tile instanceof EnergyTile) {
          if ((tile as TileD).propagatePower(grid, entities)) {
            changed = true
          }
        }
        // 2. WPT 무선/유선 전파
        else if (tile instanceof TileWPT) {
          if (tile.propagatePower(grid)) {
            changed = true
          }
        }
      }
    }

    return changed
  }
}
