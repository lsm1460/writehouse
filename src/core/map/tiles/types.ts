import type { GridType } from '~/core/types'
import { Tile } from '../Tile'
import { PushTile } from './PushTile'

export abstract class WalkableTile extends Tile {
  override get isWalkable(): boolean {
    return true
  }

  wet() {
    this.isWet = true
  }

  dry() {
    this.isWet = false
    this.isElectrified = false
  }
}

export abstract class IElectricTile extends PushTile {
  _hasEnergy: boolean = false
  isElectric = true

  override getData() {
    return {
      hasEnergy: this._hasEnergy,
    }
  }

  override setData(data: any) {
    if (data && typeof data.hasEnergy === 'boolean') this._hasEnergy = data.hasEnergy
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

export interface IEnvironmentTile {
  onEnvironmentUpdate(deltaTime: number, mapSystem: GridType): boolean
}

export function isEnvironmentTile(tile: any): tile is IEnvironmentTile {
  return tile && typeof (tile as any).onEnvironmentUpdate === 'function'
}

export interface IMonsterTile extends Tile {
  direction: string
  x: number
  y: number
  lastX: number
  lastY: number
  char: string

  renderX: number
  renderY: number
  moveStartTime: number

  getNextPosition(grid: any[][], entities: any[][]): { nx: number; ny: number }
  updatePosition(nx: number, ny: number): void
  stayQuiet(): void
}

export function isMonsterTile(tile: any): tile is IMonsterTile {
  return (
    tile &&
    (tile.char === 'm' ||
      tile.char === 'M' ||
      (typeof (tile as any).getNextPosition === 'function' &&
        typeof (tile as any).updatePosition === 'function' &&
        typeof (tile as any).stayQuiet === 'function'))
  )
}
