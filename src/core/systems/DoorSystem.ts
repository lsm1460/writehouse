import type { EngineContext } from '../engineContext'
import { TileDoor } from '../map/tiles/TileDoor'

export class DoorSystem {
  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public update(): boolean {
    const grid = this.ctx.map.grid
    let changed = false

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]

        if (tile instanceof TileDoor) {
          if (tile.updateDoorState(grid, this.ctx)) {
            changed = true
          }
        }
      }
    }

    return changed
  }
}
