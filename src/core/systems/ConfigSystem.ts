import type { EngineContext } from "../engineContext"

export class ConfigSystem {
  private context: EngineContext
  public lang: string
  public tooltipEnabled: boolean = true

  public bgmVolume: number = 0.5
  public ambientVolume: number = 0.5
  public sfxVolume: number = 0.5

  constructor(context: EngineContext, initialLang: string) {
    this.context = context
    this.lang = initialLang

    const saved = this.context.save.load()
    if (saved) {
      this.tooltipEnabled = saved.tooltipEnabled ?? true
      this.bgmVolume = saved.bgmVolume ?? 0.5
      this.ambientVolume = saved.ambientVolume ?? 0.5
      this.sfxVolume = saved.sfxVolume ?? 0.5
    }
  }

  public get saveData() {
    return {
      language: this.lang,
      tooltipEnabled: this.tooltipEnabled,
      bgmVolume: this.bgmVolume,
      ambientVolume: this.ambientVolume,
      sfxVolume: this.sfxVolume,
    }
  }

  public setLang(lang: string) {
    this.lang = lang
    const roomId = this.context.save.load()?.roomId || ''
    this.context.save.save(roomId, this.saveData)
  }

  public setTooltipEnabled(val: boolean) {
    this.tooltipEnabled = val
    const roomId = this.context.save.load()?.roomId || ''
    this.context.save.save(roomId, this.saveData)
  }

  public setBgmVolume(val: number) {
    this.bgmVolume = val
    this.context.sound.setBgmVolume(val)
    const roomId = this.context.save.load()?.roomId || ''
    this.context.save.save(roomId, this.saveData)
  }

  public setAmbientVolume(val: number) {
    this.ambientVolume = val
    this.context.sound.setAmbientVolume(val)
    const roomId = this.context.save.load()?.roomId || ''
    this.context.save.save(roomId, this.saveData)
  }

  public setSfxVolume(val: number) {
    this.sfxVolume = val
    this.context.sound.setSfxVolume(val)
    const roomId = this.context.save.load()?.roomId || ''
    this.context.save.save(roomId, this.saveData)
  }
}
