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

  public start() {
    this.ctx.fog.update()
    this.ctx.onChange()
    this.tickTurn()
  }

  public move(dir: Direction) {
    const isMove = this.ctx.player.move(dir)
    isMove && this.tickTurn()
  }

  public processTileAction() {
    const { map, inventory } = this.ctx
    const targetTile = map.getTargetTile()

    if (!targetTile) return

    if (inventory.canPick()) {
      inventory.pickup(targetTile, map.grid)
    } else {
      inventory.leftOrMix(targetTile, map.grid)
    }

    this.tickTurn()
  }

  private tickTurn() {
    const TURN_DELTA = 1.0
    const hasChanges = this.ctx.environment.update(TURN_DELTA)

    if (hasChanges) {
      this.ctx.fog.update()
    }
    this.notify()
  }
}