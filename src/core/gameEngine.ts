import { EngineContext } from './engineContext'

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type GameStatus = 'PLAYING' | 'GAME_OVER'

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
  private status: GameStatus = 'PLAYING'

  constructor(mapData: MapData, roomId: string = '1-1') {
    this.ctx = new EngineContext(mapData, roomId, () => this.notify())
  }

  public getSnapshot() {
    return this.stateId
  }

  get gameStatus(): GameStatus {
    return this.status
  }

  public subscribe(callback: () => void) {
    this.onUpdateCallback = callback
  }

  private notify() {
    this.stateId += 1
    if (this.onUpdateCallback) this.onUpdateCallback()
  }

  public start() {
    this.ctx.init()
  }

  public move(dir: Direction) {
    if (this.status === 'GAME_OVER') return

    const isMoved = this.ctx.player.move(dir)
    if (isMoved) {
      this.processTurn()
    }
  }

  public processTileAction() {
    if (this.status === 'GAME_OVER') return

    const { map, inventory } = this.ctx
    const targetTile = map.getTargetTile()

    if (!targetTile) return

    if (inventory.canPick()) {
      inventory.pickup(targetTile, map.grid)
    } else {
      inventory.leftOrMix(targetTile, map.grid)
    }

    this.processTurn()
  }

  public nextStage() {
    if (this.status === 'GAME_OVER') return
    this.ctx.nextStage()
  }

  public retryStage() {
    this.status = 'PLAYING'

    this.ctx.retryStage()
  }

  private processTurn() {
    const isAlive = this.ctx.tickTurn()
    
    if (!isAlive) {
      this.status = 'GAME_OVER'
    }

    this.notify()
  }
}