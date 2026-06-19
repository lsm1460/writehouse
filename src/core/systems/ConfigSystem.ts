import type { EngineContext } from "../engineContext"

export class ConfigSystem {
  private context: EngineContext
  public lang: string
  public tooltipEnabled: boolean = true

  constructor(context: EngineContext, initialLang: string) {
    this.context = context
    this.lang = initialLang
  }

  public get saveData() {
    return {
      language: this.lang,
      tooltipEnabled: this.tooltipEnabled,
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
}