import { EngineContext } from '../engineContext'
import { Tile } from '../map/Tile'

export class InventorySystem {
  public inventory: Record<string, number> = {}
  public quickSlots: string[] = ['', '', '', '']
  public slotIndex: number | null = null

  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public get itemCounts(): Record<string, number> {
    return { ...this.inventory }
  }

  public canPick() {
    return this.slotIndex === null || !this.quickSlots[this.slotIndex]
  }

  public selectSlot(slotNumber: number) {
    const targetIndex = slotNumber - 1

    if (this.slotIndex === targetIndex) {
      this.slotIndex = null
    } else {
      this.slotIndex = targetIndex
    }

    this.ctx.onChange()
  }

  public pickup(targetTile: Tile) {
    if (!targetTile.canPick()) return

    const item = targetTile.char

    this.inventory[item] = (this.inventory[item] || 0) + 1

    const emptyQuickIndex = this.quickSlots.indexOf('')
    if (emptyQuickIndex !== -1) {
      this.quickSlots[emptyQuickIndex] = item
    }

    targetTile.toEmpty()
    
    this.ctx.fog.update()
    this.ctx.onChange()
  }

  public leftOrMix(targetTile: Tile) {
    if (this.slotIndex === null) return

    const item = this.quickSlots[this.slotIndex]
    if (!item) return

    if (!this.inventory[item] || this.inventory[item] <= 0) {
      this.clearQuickSlot(this.slotIndex)
      this.ctx.onChange()
      return
    }

    if (!targetTile.canPick()) return

    if (!targetTile.canMix()) {
      targetTile.setChar(item)
      this.consumeItem(item)
      return
    }

    targetTile.mix(item)
    this.consumeItem(item)
  }

  private consumeItem(item: string) {
    this.inventory[item]--

    if (this.inventory[item] <= 0) {
      delete this.inventory[item] // 완전히 삭제

      for (let i = 0; i < this.quickSlots.length; i++) {
        if (this.quickSlots[i] === item) {
          this.clearQuickSlot(i)
        }
      }
    }

    this.ctx.fog.update()
    this.ctx.onChange()
  }

  private clearQuickSlot(index: number) {
    this.quickSlots[index] = ''
  }
}
