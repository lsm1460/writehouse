import type { GridType } from '~/core/types'
import { PushTile } from './PushTile'
import { type IEnvironmentTile } from './types'

export class TileA extends PushTile implements IEnvironmentTile {
  constructor(x: number, y: number) {
    super('A', x, y)
  }

  override get lightRadius() {
    return 1
  }

  public onEnvironmentUpdate(deltaTime: number, grid: GridType): boolean {
    return false
  }
}
