import { IElectricTile } from './types'

export class Tile1 extends IElectricTile {
  constructor(x: number, y: number) {
    super('1', x, y)
  }

  override get isWalkable(): boolean {
    return true
  }

  override get isPushable(): boolean {
    return false
  }

  override get lightRadius() {
    return 0 + (this._hasEnergy ? 1 : 0)
  }
}
