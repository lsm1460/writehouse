import type { EngineContext } from '../engineContext'
import type { GridType } from '~/core/types'
import { EnergyTile } from '../map/tiles/EnergyTile'

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

  public update(grid: GridType): boolean {
    let changed = false
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]
        if (tile instanceof EnergyTile) {
          if ((tile as EnergyTile).propagatePower(grid)) {
            changed = true
          }
        }
      }
    }
    return changed
  }
}
