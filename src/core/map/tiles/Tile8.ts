import type { GridType } from '~/core/types'
import { EnergyTile } from './EnergyTile'

export class Tile8 extends EnergyTile {
  constructor(x: number, y: number) {
    super('8', x, y)
  }

  override get lightRadius() {
    return 1
  }

  override get hasEnergy(): boolean {
    return true
  }

  override onEnvironmentUpdate(deltaTime: number, grid: GridType): boolean {
    return this.propagatePower(grid)
  }
}
