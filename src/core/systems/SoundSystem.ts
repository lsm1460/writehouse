import * as Tone from 'tone'
import { AmbientSoundSystem } from './sounds/AmbientSoundSystem'
import { SoundCategory } from './sounds/SoundCategory'
import type { SoundConfig } from './sounds/types'
import type { EngineContext } from '../engineContext'

export class SoundSystem {
  public ambient: AmbientSoundSystem
  private bgmVolumeNode: Tone.Volume
  private ambientVolumeNode: Tone.Volume
  private sfxVolumeNode: Tone.Volume

  private bgmCategory: SoundCategory
  private ambientCategory: SoundCategory
  private sfxCategory: SoundCategory
  private isMuted: boolean = false

  constructor(config: SoundConfig, ctx: EngineContext) {
    this.bgmVolumeNode = new Tone.Volume(0).toDestination()
    this.ambientVolumeNode = new Tone.Volume(0).toDestination()
    this.sfxVolumeNode = new Tone.Volume(0).toDestination()

    this.bgmCategory = new SoundCategory(config.bgm || {}, this.bgmVolumeNode, true, -22)
    this.ambientCategory = new SoundCategory(config.ambient || {}, this.ambientVolumeNode, true, -18)
    this.sfxCategory = new SoundCategory(config.sfx || {}, this.sfxVolumeNode, false, -10)

    this.ambient = new AmbientSoundSystem(this.ambientCategory, ctx)
  }

  public async resumeContext(): Promise<void> {
    if (Tone.getContext().state !== 'running') {
      await Tone.start()
    }
  }

  public async preloadAll(): Promise<void> {
    await Tone.loaded()
  }

  public playBgm(key: string, options?: { loop?: boolean; fadeIn?: number }): void {
    this.bgmCategory.play(key, options)
  }

  public stopBgm(key?: string, fadeOut?: number): void {
    this.bgmCategory.stop(key, fadeOut)
  }

  public playAmbient(key: string, options?: { loop?: boolean; fadeIn?: number }): void {
    this.ambientCategory.play(key, options)
  }

  public stopAmbient(key?: string, fadeOut?: number): void {
    this.ambientCategory.stop(key, fadeOut)
  }

  public playSfx(key: string, options?: { random?: boolean }): void {
    this.sfxCategory.play(key, options)
  }

  public setBgmVolume(value: number): void {
    this.bgmVolumeNode.volume.value = Tone.gainToDb(value)
  }

  public setAmbientVolume(value: number): void {
    this.ambientVolumeNode.volume.value = Tone.gainToDb(value)
  }

  public setSfxVolume(value: number): void {
    this.sfxVolumeNode.volume.value = Tone.gainToDb(value)
  }

  public setMasterVolume(value: number): void {
    Tone.getDestination().volume.value = Tone.gainToDb(value)
  }

  public setMute(mute: boolean): void {
    this.isMuted = mute
    Tone.getDestination().mute = mute
  }

  public getMute(): boolean {
    return this.isMuted
  }

  public stopAll(): void {
    this.bgmCategory.stop()
    this.ambientCategory.stop()
    this.sfxCategory.stop()
  }

  public dispose(): void {
    this.bgmCategory.dispose()
    this.ambientCategory.dispose()
    this.sfxCategory.dispose()
    this.bgmVolumeNode.dispose()
    this.ambientVolumeNode.dispose()
    this.sfxVolumeNode.dispose()
  }
}
