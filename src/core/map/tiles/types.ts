import type { GridType } from '~/core/types'
import { Tile } from '../Tile'

export abstract class WalkableTile extends Tile {
  override get isWalkable(): boolean {
    return true
  }
}

export abstract class IElectricTile extends Tile {
  setPower(powered: boolean): boolean {
    return false
  }
  resetPower(): void {}
}

export interface IEnvironmentTile {
  onEnvironmentUpdate(deltaTime: number, mapSystem: GridType): boolean
}

export function isEnvironmentTile(tile: any): tile is IEnvironmentTile {
  return tile && typeof (tile as any).onEnvironmentUpdate === 'function'
}
