import { IElectricTile } from './types'

export class TileL extends IElectricTile {
  constructor(x: number, y: number) {
    super('L', x, y)
  }

  override get lightRadius() {
    return 3 + (this._hasEnergy ? 1 : 0)
  }
}
