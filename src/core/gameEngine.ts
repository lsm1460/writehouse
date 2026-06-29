import type { AssetsType } from '~/assets'
import { EngineContext } from './engineContext'

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type GameStatus = 'TITLE' | 'PLAYING' | 'GAME_OVER' | 'PAUSE' | 'ENDING'

export interface Position {
  x: number
  y: number
}

export interface MapData {
  floors: {
    floor_number: number
    rooms: {
      room_id: string
      grid: string[][]
    }[]
  }[]
}

export class GameEngine {
  public ctx: EngineContext
  private stateId: number = 0
  private onUpdateCallback?: () => void
  private status: GameStatus = 'TITLE'

  constructor(assets: AssetsType, lang: string) {
    this.ctx = new EngineContext(
      assets,
      lang,
      () => this.notify(),
      (status) => this.setGameStatus(status)
    )
  }

  public getSnapshot() {
    return this.stateId
  }

  get gameStatus(): GameStatus {
    return this.status
  }

  private setGameStatus(val: GameStatus) {
    this.status = val
  }

  public subscribe(callback: () => void) {
    this.onUpdateCallback = callback
  }

  private notify() {
    this.stateId += 1
    if (this.onUpdateCallback) this.onUpdateCallback()
  }

  public start(roomId?: string) {
    this.ctx.isStageSelectPlay = !!roomId
    this.status = 'PLAYING'
    this.ctx.init(roomId)
  }

  public load(): boolean {
    const saveData = this.ctx.save.load()
    if (!saveData) return false

    this.status = 'PLAYING'
    this.ctx.init(saveData.roomId)
    this.notify()
    return true
  }

  public move(dir: Direction) {
    if (this.status !== 'PLAYING') return

    const beforeState = this.ctx.captureState()
    const isMoved = this.ctx.player.move(dir)
    this.ctx.sound.ambient.update()

    if (!isMoved) return

    this.ctx.player.updateTargetPosition()

    const afterState = this.ctx.captureState()
    if (this.ctx.isStateChanged(beforeState, afterState)) {
      this.ctx.pushState(beforeState)
      this.processTurn()
    }
  }

  public undo() {
    if (this.status !== 'PLAYING' && this.status !== 'GAME_OVER') return

    const undone = this.ctx.undo()
    if (undone) {
      this.status = 'PLAYING'
      this.notify()
    }
  }

  public retryStage() {
    this.status = 'PLAYING'
    this.ctx.retryStage()
  }

  public togglePause() {
    this.status = this.status === 'PAUSE' ? 'PLAYING' : 'PAUSE'
    this.notify()
  }

  private processTurn() {
    const isAlive = this.ctx.tickTurn()

    if (!isAlive) {
      this.status = 'GAME_OVER'
    }

    this.notify()
  }
}
