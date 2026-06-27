import type { AssetsType } from '~/assets'
import { EnvironmentManager } from './managers/EnvironmentManager'
import { CheatSystem } from './systems/CheatSystem'
import { ConfigSystem } from './systems/ConfigSystem'
import { EffectSystem } from './systems/EffectSystem'
import { FogSystem } from './systems/fogSystem'
import { HistorySystem } from './systems/historySystem'
import { MapSystem } from './systems/mapSystem'
import { PlayerSystem } from './systems/playerSystem'
import { SaveSystem } from './systems/SaveSystem'
import { SoundSystem } from './systems/SoundSystem'
import { StageSystem } from './systems/StageSystem'
import { delay } from './utils'

export class EngineContext {
  public map: MapSystem
  public player: PlayerSystem
  public fog: FogSystem
  public stage: StageSystem
  public environment: EnvironmentManager
  public save: SaveSystem
  public effects: EffectSystem
  public config: ConfigSystem
  public sound: SoundSystem

  public turn: number = 0
  private _isLoading: boolean = false
  private history: HistorySystem
  private cheat: CheatSystem
  private notifyEngine: () => void
  private setEndingState: () => void

  constructor(assets: AssetsType, lang: string, notifyEngine: () => void, setEndingState: () => void) {
    this.notifyEngine = notifyEngine
    this.setEndingState = setEndingState

    this.map = new MapSystem(this, assets.map)
    this.player = new PlayerSystem(this)
    this.fog = new FogSystem(this)
    this.stage = new StageSystem(this)
    this.environment = new EnvironmentManager(this)
    this.save = new SaveSystem(notifyEngine)
    this.effects = new EffectSystem(this)
    this.config = new ConfigSystem(this, lang)
    this.sound = new SoundSystem(assets.sound || {}, this)

    this.sound.setBgmVolume(this.config.bgmVolume)
    this.sound.setAmbientVolume(this.config.ambientVolume)
    this.sound.setSfxVolume(this.config.sfxVolume)
    this.sound.setMute(this.config.isMuted)

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

  public get isLoading(): boolean {
    return this._isLoading
  }

  public async init(roomId?: string, forceImmediate = false): Promise<boolean> {
    const targetRoomId = roomId || '0-1'
    const isSameRoom = this.map.currentRoomId === targetRoomId

    this.prepareLoading(forceImmediate, isSameRoom)

    const startTime = Date.now()

    const spawn = this.map.loadRoom(targetRoomId)
    if (!spawn) {
      this.handleLoadFailure(forceImmediate)
      return false
    }

    this.resetSystemStates(spawn)

    await this.finalizeLoading(startTime, forceImmediate, isSameRoom)

    return true
  }

  private prepareLoading(forceImmediate: boolean, isSameRoom: boolean): void {
    if (!forceImmediate) {
      this._isLoading = true
      this.onChange()
    }

    if (!isSameRoom) {
      this.sound.stopBgm()
    }
  }

  private handleLoadFailure(forceImmediate: boolean): void {
    if (!forceImmediate) {
      this._isLoading = false
      this.onChange()
    }
  }

  private resetSystemStates(spawn: { x: number; y: number }): void {
    this.turn = 0
    this.history.clear()
    this.effects.clear()

    this.stage.reset()

    this.player.spawn(spawn)

    this.fog.update()
    this.onChange()
    this.tickTurn()
  }

  private async finalizeLoading(startTime: number, forceImmediate: boolean, isSameRoom: boolean): Promise<void> {
    if (!forceImmediate) {
      const elapsedTime = Date.now() - startTime
      const MIN_DELAY = 3500

      if (elapsedTime < MIN_DELAY) {
        await delay(MIN_DELAY - elapsedTime)
      }

      this._isLoading = false
      this.onChange()
    }

    if (!isSameRoom) {
      this.sound.playBgm('main_theme')
    }
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

    this.history.clear()

    if (id) {
      this.save.save(id, this.config.saveData)

      this.init(id)
    } else {
      this.setEndingState()

      this.notifyEngine()
    }
  }

  public retryStage() {
    this.sound.stopAmbient()

    this.init(this.map.currentRoomId, true).catch((err) => console.error('재시작 중 오류 발생:', err))
  }

  public executeCheat(command: string): string | null {
    return this.cheat.execute(command)
  }
}
