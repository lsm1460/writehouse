import { EngineContext } from '../engineContext'
import { Tile } from '../map/Tile'
import { createTile } from '../map/tiles'
import type { GridType } from '../types'

export interface InventoryItem {
  char: string
  meta?: any
}

export class InventorySystem {
  public currentItem: InventoryItem | null = null

  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public reset() {
    this.currentItem = null
  }

  public canPick(): boolean {
    return this.currentItem === null
  }

  public pickup(targetTile: Tile, grid: GridType) {
    if (!targetTile.canPick() || !this.canPick()) return

    targetTile.onDestroy(grid)
    this.currentItem = {
      char: targetTile.char,
      meta: targetTile.getData(),
    }

    const defaultFloorChar = ''
    grid[targetTile.y][targetTile.x] = createTile(defaultFloorChar, targetTile.x, targetTile.y)

    this.ctx.fog.update()
    this.ctx.onChange()
  }

  public leftOrMix(targetTile: Tile, grid: GridType) {
    if (!this.currentItem) return

    const itemChar = this.currentItem.char
    const itemMeta = this.currentItem.meta
    const { x, y } = targetTile

    const mixedChar = targetTile.getMixedResult(itemChar)

    if (mixedChar) {
      grid[y][x] = createTile(mixedChar, x, y)
      this.consumeItem()
      return
    }

    if (targetTile.isEmptyFloor) {
      grid[y][x] = createTile(itemChar, x, y, itemMeta)
      this.consumeItem()
      return
    }
  }

  private consumeItem() {
    this.currentItem = null

    this.ctx.fog.update()
    this.ctx.onChange()
  }
}
