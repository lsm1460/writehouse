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
  isElectric = true
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

export interface IMonsterTile extends Tile {
  x: number
  y: number
  lastX: number
  lastY: number
  char: string
  
  getNextPosition(grid: any[][], entities: any[][]): { nx: number; ny: number }
  updatePosition(nx: number, ny: number): void
  stayQuiet(): void
}
