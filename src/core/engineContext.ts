import i18n from '~/i18n'
import type { MapData } from './gameEngine'
import { EnvironmentSystem } from './systems/EnvironmentSystem'
import { FogSystem } from './systems/fogSystem'
import { InventorySystem } from './systems/inventorySystem'
import { MapSystem } from './systems/mapSystem'
import { PlayerSystem } from './systems/playerSystem'
import { SaveSystem } from './systems/SaveSystem'
import { StageSystem } from './systems/StageSystem'
import { delay } from './utils'

export class EngineContext {
  public map: MapSystem
  public player: PlayerSystem
  public inventory: InventorySystem
  public fog: FogSystem
  public stage: StageSystem
  public environment: EnvironmentSystem
  public save: SaveSystem

  private notifyEngine: () => void

  constructor(mapData: MapData, notifyEngine: () => void) {
    this.notifyEngine = notifyEngine

    this.map = new MapSystem(this, mapData)
    this.player = new PlayerSystem(this)
    this.inventory = new InventorySystem(this)
    this.fog = new FogSystem(this)
    this.stage = new StageSystem(this)
    this.environment = new EnvironmentSystem(this)
    this.save = new SaveSystem(notifyEngine)
  }

  public get grid() {
    return this.map.grid
  }

  public get stageClear(): boolean {
    return this.stage.isClear
  }

  public init(roomId?: string) {
    const spawn = this.map.loadRoom(roomId || '1-1')

    spawn && this.setPlayer(spawn)

    this.fog.update()
    this.onChange()

    this.tickTurn()
  }

  public saveGame(id: string) {
    const currentLanguage = i18n.language || 'ko'

    this.save.save(id, currentLanguage)
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

  public async nextStage() {
    const id = this.map.getNextRoomId()

    if (id) {
      this.saveGame(id)

      this.map.currentRoomId = id

      await delay()

      this.init(id)
    }
  }

  public retryStage() {
    this.init(this.map.currentRoomId)
  }

  private setPlayer(pos: { x: number; y: number }) {
    this.stage.reset()
    this.inventory.reset()

    this.player.pos = { ...pos }
    this.player.dir = 'UP'

    this.player.updateTargetPosition()
  }
}
