import type { MapData } from './gameEngine'
import { FogSystem } from './systems/fogSystem'
import { InventorySystem } from './systems/inventorySystem'
import { MapSystem } from './systems/mapSystem'
import { PlayerSystem } from './systems/playerSystem'

export class EngineContext {
  public map: MapSystem
  public player: PlayerSystem
  public inventory: InventorySystem
  public fog: FogSystem

  private notifyEngine: () => void

  constructor(mapData: MapData, roomId: string, notifyEngine: () => void) {
    this.notifyEngine = notifyEngine

    this.map = new MapSystem(this, mapData, roomId)
    this.player = new PlayerSystem(this)
    this.inventory = new InventorySystem(this)
    this.fog = new FogSystem(this)
  }

  public onChange() {
    this.notifyEngine()
  }

  public nextStage() {
    const spawn = this.map.loadNextRoom()

    if (spawn) {
      this.player.pos = { ...spawn }
      this.player.dir = 'UP'

      this.player.updateTargetPosition()
      this.fog.update()
      this.onChange()
    }
  }
}
