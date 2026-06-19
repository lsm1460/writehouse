import type { MapData } from './gameEngine'
import { EnvironmentManager } from './managers/EnvironmentManager'
import { CheatSystem } from './systems/CheatSystem'
import { ConfigSystem } from './systems/ConfigSystem'
import { EffectSystem } from './systems/EffectSystem'
import { FogSystem } from './systems/fogSystem'
import { HistorySystem } from './systems/historySystem'
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
  public environment: EnvironmentManager
  public save: SaveSystem
  public effects: EffectSystem
  public config: ConfigSystem
  
  public turn: number = 0
  private history: HistorySystem
  private cheat: CheatSystem
  private notifyEngine: () => void

  constructor(mapData: MapData, lang: string, notifyEngine: () => void) {
    this.notifyEngine = notifyEngine

    this.map = new MapSystem(this, mapData)
    this.player = new PlayerSystem(this)
    this.inventory = new InventorySystem(this)
    this.fog = new FogSystem(this)
    this.stage = new StageSystem(this)
    this.environment = new EnvironmentManager(this)
    this.save = new SaveSystem(notifyEngine)
    this.effects = new EffectSystem(this)
    this.config = new ConfigSystem(this, lang)

    this.history = new HistorySystem(this)
    this.cheat = new CheatSystem(this)
  }

  public get grid() {
    return this.map.grid
  }

  public get entities() {
    return this.map.entities
  }

  public get stageClear(): boolean {
    return this.stage.isClear
  }

  public get lang(): string {
    return this.config.lang
  }

  public get tooltipEnabled(): boolean {
    return this.config.tooltipEnabled
  }

  public init(roomId?: string): boolean {
    const spawn = this.map.loadRoom(roomId || '0-1')
    if (!spawn) {
      return false
    }

    this.turn = 0
    this.history.clear()
    this.effects.clear()

    this.stage.reset()
    this.inventory.reset()

    this.player.spawn(spawn)

    this.fog.update()
    this.onChange()

    this.tickTurn()
    return true
  }

  public getPlayerMovementState() {
    return {
      x: this.player.pos.x,
      y: this.player.pos.y,
      lastX: this.player.lastX,
      lastY: this.player.lastY,
    }
  }

  public updateFogAndNotify(): void {
    this.fog.update()
    this.onChange()
  }

  public captureState() {
    return this.history.captureState()
  }

  public pushState(state: any) {
    this.history.pushState(state)
  }

  public isStateChanged(s1: any, s2: any): boolean {
    return this.history.isStateChanged(s1, s2)
  }

  public undo(): boolean {
    const success = this.history.undo()
    if (!success) return false

    this.effects.clear()
    this.fog.update()
    this.onChange()
    return true
  }

  public onChange() {
    this.stage.updateClearStatus()
    this.notifyEngine()
  }

  public tickTurn(): boolean {
    this.effects.clear()

    this.turn += 1
    const TURN_DELTA = 1.0

    if (this.player.checkEnvironmentEffects()) return false

    const hasChanges = this.environment.update(TURN_DELTA)
    this.fog.update()

    if (hasChanges) {
      this.onChange()
    }

    return !this.player.checkEnvironmentEffects()
  }

  public async nextStage() {
    const id = this.map.getNextRoomId()

    if (id) {
      this.save.save(id, this.config.saveData)
      this.map.currentRoomId = id
      await delay()
      this.init(id)
    }
  }

  public retryStage() {
    this.init(this.map.currentRoomId)
  }

  public setLang(lang: string) {
    this.config.setLang(lang)
  }

  public setTooltipEnabled(val: boolean) {
    this.config.setTooltipEnabled(val)
  }

  public executeCheat(command: string): string | null {
    return this.cheat.execute(command)
  }
}