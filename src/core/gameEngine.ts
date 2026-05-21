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

  private lastTime: number = 0
  private animationFrameId: number | null = null
  private isRunning: boolean = false
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

  public processTileAction() {
    const { map, inventory } = this.ctx
    const targetTile = map.getTargetTile()

    if (!targetTile) return

    if (inventory.canPick()) {
      inventory.pickup(targetTile, map.grid)
    } else {
      inventory.leftOrMix(targetTile, map.grid)
    }
  }

  public startLoop() {
    if (this.isRunning) return
    this.isRunning = true
    this.lastTime = performance.now()
    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  public stopLoop() {
    this.isRunning = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  private loop = (currentTime: number) => {
    if (!this.isRunning) return

    const deltaTime = (currentTime - this.lastTime) / 1000
    this.lastTime = currentTime

    const hasChanges = this.ctx.environment.update(deltaTime)

    if (hasChanges) {
      this.ctx.fog.update()
      this.notify()
    }

    this.animationFrameId = requestAnimationFrame(this.loop)
  }
}
