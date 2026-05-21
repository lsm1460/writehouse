import { EngineContext } from '../engineContext'
import { Tile } from '../map/Tile'
import { createTile } from '../map/tiles'
import type { GridType } from '../types'

export class InventorySystem {
  public currentItem: string = ''

  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public reset() {
    this.currentItem = ''
  }

  public canPick(): boolean {
    return this.currentItem === ''
  }

  public pickup(targetTile: Tile, grid: GridType) {
    if (!targetTile.canPick() || !this.canPick()) return

    this.currentItem = targetTile.char

    const defaultFloorChar = ''
    grid[targetTile.y][targetTile.x] = createTile(defaultFloorChar, targetTile.x, targetTile.y)

    this.ctx.fog.update()
    this.ctx.onChange()
  }

  public leftOrMix(targetTile: Tile, grid: GridType) {
    if (!this.currentItem) return
    if (!targetTile.canPick()) return

    const isSuccess = targetTile.mix(this.currentItem)
    if (!isSuccess) return

    grid[targetTile.y][targetTile.x] = createTile(targetTile.char, targetTile.x, targetTile.y)

    this.consumeItem()
  }

  private consumeItem() {
    this.currentItem = ''

    this.ctx.fog.update()
    this.ctx.onChange()
  }
}
