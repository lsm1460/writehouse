import { EngineContext } from '../engineContext'
import { Tile } from '../map/Tile'

export class InventorySystem {
  public currentItem: string = ''

  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }
  public canPick(): boolean {
    return this.currentItem === ''
  }

  public pickup(targetTile: Tile) {
    if (!targetTile.canPick() || !this.canPick()) return

    this.currentItem = targetTile.char

    targetTile.toEmpty()
    
    this.ctx.fog.update()
    this.ctx.onChange()
  }

  public leftOrMix(targetTile: Tile) {
    console.log('targetTile',targetTile)
    if (!this.currentItem) return

    if (!targetTile.canPick()) return

    const itemToUse = this.currentItem

    if (!targetTile.canMix()) {
      targetTile.setChar(itemToUse)
      this.consumeItem()
      return
    }

    targetTile.mix(itemToUse)
    this.consumeItem()
  }

  private consumeItem() {
    this.currentItem = ''

    this.ctx.fog.update()
    this.ctx.onChange()
  }
}