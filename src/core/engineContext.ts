import type { MapData } from './gameEngine'
import { FogSystem } from './systems/fogSystem'
import { InventorySystem } from './systems/inventorySystem'
import { MapSystem } from './systems/mapSystem'
import { PlayerSystem } from './systems/playerSystem'
import { StageSystem } from './systems/StageSystem'

export class EngineContext {
  public map: MapSystem
  public player: PlayerSystem
  public inventory: InventorySystem
  public fog: FogSystem
  public stage: StageSystem

  private notifyEngine: () => void

  constructor(mapData: MapData, roomId: string, notifyEngine: () => void) {
    this.notifyEngine = notifyEngine

    this.map = new MapSystem(this, mapData, roomId)
    this.player = new PlayerSystem(this)
    this.inventory = new InventorySystem(this)
    this.fog = new FogSystem(this)
    this.stage = new StageSystem(this)
  }

  public get stageClear(): boolean {
    return this.stage.isClear
  }

  public onChange() {
    this.stage.updateClearStatus()

    this.notifyEngine()
  }

  public nextStage() {
    const spawn = this.map.loadNextRoom()

    if (spawn) {
      this.stage.reset()

      this.player.pos = { ...spawn }
      this.player.dir = 'UP'

      this.player.updateTargetPosition()
      this.fog.update()
      this.onChange()
    }
  }
}
