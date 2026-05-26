import type { GridType } from '~/core/types'
import { EnergyTile } from './EnergyTile'

export class TileE extends EnergyTile {
  public age: number = 0
  private readonly ENERGY_LIFETIME = 5
  public isDischarged: boolean = false

  constructor(x: number, y: number) {
    super('E', x, y)
  }

  override getData() {
    return { isDischarged: this.isDischarged }
  }

  override setData(data: any) {
    if (data && typeof data.isDischarged === 'boolean') {
      this.isDischarged = data.isDischarged
    }
  }

  override get lightRadius() {
    return this.isDischarged ? 0 : 1
  }

  override get hasEnergy(): boolean {
    return !this.isDischarged
  }

  override onEnvironmentUpdate(deltaTime: number, grid: GridType): boolean {
    if (this.isDischarged) return false

    this.age += deltaTime

    if (this.age >= this.ENERGY_LIFETIME) {
      this.drained()
      return true
    }

    return this.propagatePower(grid)
  }

  drained() {
    this.isDischarged = true
    this.age = 0
  }
}