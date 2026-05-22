import type { MapData } from './gameEngine'
import { EnvironmentSystem } from './systems/EnvironmentSystem'
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
  public environment: EnvironmentSystem

  private notifyEngine: () => void

  constructor(mapData: MapData, roomId: string, notifyEngine: () => void) {
    this.notifyEngine = notifyEngine

    this.map = new MapSystem(this, mapData, roomId)
    this.player = new PlayerSystem(this)
    this.inventory = new InventorySystem(this)
    this.fog = new FogSystem(this)
    this.stage = new StageSystem(this)
    this.environment = new EnvironmentSystem(this)
  }

  public get grid() {
    return this.map.grid
  }

  public get stageClear(): boolean {
    return this.stage.isClear
  }

  public init() {
    this.fog.update()
    this.onChange()

    this.tickTurn()
  }

  public onChange() {
    this.stage.updateClearStatus()
    this.notifyEngine()
  }

  public tickTurn(): boolean {
    const TURN_DELTA = 1.0
    const hasChanges = this.environment.update(TURN_DELTA)

    if (hasChanges) {
      this.fog.update()
    }

    const isGameOver = this.player.checkEnvironmentEffects(this.grid)
    return !isGameOver
  }

  public nextStage() {
    const spawn = this.map.loadNextRoom()

    if (spawn) {
      this.stage.reset()
      this.inventory.reset()

      this.player.pos = { ...spawn }
      this.player.dir = 'UP'

      this.player.updateTargetPosition()
      this.init()
    }
  }

  public retryStage() {
    const spawn = this.map.reloadCurrentRoom()

    if (spawn) {
      this.stage.reset()
      this.inventory.reset()

      this.player.pos = { ...spawn }
      this.player.dir = 'UP'

      this.player.updateTargetPosition()
      this.init()
    }
  }
}
