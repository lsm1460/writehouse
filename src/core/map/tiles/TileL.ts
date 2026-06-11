import { IElectricTile } from './types'

export class TileL extends IElectricTile {
  private _hasEnergy: boolean = false

  constructor(x: number, y: number) {
    super('L', x, y)
  }

  override get lightRadius() {
    return 3 + (this._hasEnergy ? 1 : 0)
  }

  public get hasEnergy(): boolean {
    return this._hasEnergy
  }

  public setPower(powered: boolean): boolean {
    const previousState = this._hasEnergy
    this._hasEnergy = powered

    return previousState !== this._hasEnergy
  }

  public resetPower() {
    this._hasEnergy = false
  }
}
