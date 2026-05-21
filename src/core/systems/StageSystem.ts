import type { EngineContext } from '../engineContext'

export class StageSystem {
  private ctx: EngineContext
  private _isClear = false

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public get isClear(): boolean {
    return this._isClear
  }

  public updateClearStatus(): void {
    const grid = this.ctx.map.grid
    const fog = this.ctx.fog

    let hasInteractable = false
    let allLit = true

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]

        if (tile.char === 'i') {
          hasInteractable = true
          if (fog.getEnvLightLevel(x, y) === 0) {
            allLit = false
            break
          }
        }
      }
      if (!allLit) break
    }

    this._isClear = hasInteractable && allLit
  }

  public reset(): void {
    this._isClear = false
  }
}
