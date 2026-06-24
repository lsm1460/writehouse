import type { EngineContext } from '../engineContext'

export class StageSystem {
  private ctx: EngineContext
  private _isClear = false
  private _litBeacons: Map<string, boolean> = new Map()

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
    let hasNewlyLitBeacon = false

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]

        if (tile.char === 'i') {
          hasInteractable = true

          const isCurrentlyLit = fog.getEnvLightLevel(x, y) > 0
          const beaconKey = `${x},${y}`
          const wasLitBefore = this._litBeacons.get(beaconKey) ?? false

          if (isCurrentlyLit && !wasLitBefore) {
            hasNewlyLitBeacon = true
          }

          this._litBeacons.set(beaconKey, isCurrentlyLit)

          if (!isCurrentlyLit) {
            allLit = false
          }
        }
      }
    }

    const nextClearState = hasInteractable && allLit

    if (this.ctx.isLoading) {
      this._isClear = nextClearState
      return
    }

    if (hasNewlyLitBeacon && !nextClearState) {
      this.ctx.sound.playSfx('beacon_on')
    }

    if (nextClearState && !this._isClear) {
      this.ctx.sound.playSfx('stage_clear')
    }

    this._isClear = nextClearState
  }

  public reset(): void {
    this._isClear = false
    this._litBeacons.clear()
  }
}
