import type { GridType } from '~/core/types'
import type { EngineContext } from '../engineContext'
import { EnergyTile } from '../map/tiles/EnergyTile'
import type { TileD } from '../map/tiles/TileD'

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
    const entities = this.ctx.map.entities

    let changed = false
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]
        if (tile instanceof EnergyTile) {
          if ((tile as TileD).propagatePower(grid, entities)) {
            changed = true
          }
        }
      }
    }
    return changed
  }
}
