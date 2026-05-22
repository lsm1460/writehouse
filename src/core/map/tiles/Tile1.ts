import { IElectricTile } from './types'

export class Tile1 extends IElectricTile {
  private _hasEnergy: boolean = false

  constructor(x: number, y: number) {
    super('1', x, y)
  }

  override get isWalkable(): boolean {
    return true
  }

  override get lightRadius() {
    return 0 + (this._hasEnergy ? 1 : 0)
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