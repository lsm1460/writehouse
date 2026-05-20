import { EngineContext } from './engineContext'

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export interface Position {
  x: number
  y: number
}
export interface MapData {
  floors: { rooms: { room_id: string; title: string; grid: string[][] }[] }[]
}

export class GameEngine {
  public ctx: EngineContext
  private stateId: number = 0
  private onUpdateCallback?: () => void

  constructor(mapData: MapData, roomId: string = '1-1') {
    this.ctx = new EngineContext(mapData, roomId, () => this.notify())
  }

  public getSnapshot() {
    return this.stateId
  }

  public subscribe(callback: () => void) {
    this.onUpdateCallback = callback
  }

  private notify() {
    this.stateId += 1
    if (this.onUpdateCallback) this.onUpdateCallback()
  }

  public move(dir: Direction) {
    this.ctx.player.move(dir)
  }

  public selectSlot(slot: number) {
    this.ctx.inventory.selectSlot(slot)
  }

  public processTileAction() {
    const { map, inventory } = this.ctx
    const targetTile = map.getTargetTile()

    if (!targetTile) return

    if (inventory.canPick()) {
      inventory.pickup(targetTile)
    } else {
      inventory.leftOrMix(targetTile)
    }
  }
}
