import type { GridType } from '~/core/types'
import type { EngineContext } from '../engineContext'
import { EnergyTile } from '../map/tiles/EnergyTile'
import { isEnvironmentTile, type IEnvironmentTile } from '../map/tiles/types'

export class EnvironmentSystem {
  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public update(deltaTime: number): boolean {
    const grid = this.ctx.map.grid
    let hasAnyTileChanged = false

    this.resetElectricity(grid)

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]

        if (isEnvironmentTile(tile)) {
          const isChanged = (tile as IEnvironmentTile).onEnvironmentUpdate(deltaTime, grid)
          if (isChanged) {
            hasAnyTileChanged = true
          }
        }
      }
    }

    if (this.handleElectricityPropagation(grid)) {
      hasAnyTileChanged = true
    }

    if (this.handleFireSpreading(deltaTime, grid)) {
      hasAnyTileChanged = true
    }

    if (this.handleWaterSpreading(deltaTime, grid)) {
      hasAnyTileChanged = true
    }

    return hasAnyTileChanged
  }

  private resetElectricity(grid: GridType): void {
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

  private handleElectricityPropagation(grid: GridType): boolean {
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

  private handleFireSpreading(deltaTime: number, grid: GridType): boolean {
    return false
  }

  private handleWaterSpreading(deltaTime: number, grid: GridType): boolean {
    return false
  }
}
