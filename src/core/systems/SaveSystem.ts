export interface SaveData {
  roomId: string
  language: string
  tooltipEnabled: boolean
  bgmVolume?: number
  ambientVolume?: number
  sfxVolume?: number
  isMuted?: boolean
  savedAt: string
}

export class SaveSystem {
  private readonly SAVE_KEY = 'write_house_save_data'
  public isSaving = false
  private onStateChange?: () => void

  constructor(onStateChange?: () => void) {
    this.onStateChange = onStateChange
  }

  public save(roomId: string, config: { language: string; tooltipEnabled: boolean; bgmVolume?: number; ambientVolume?: number; sfxVolume?: number; isMuted?: boolean }): boolean {
    try {
      this.isSaving = true
      this.onStateChange?.()

      const saveData: SaveData = {
        roomId,
        ...config,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData))

      setTimeout(() => {
        this.isSaving = false
        this.onStateChange?.()
      }, 800)

      return true
    } catch (error) {
      console.error('게임 저장 중 오류 발생:', error)
      this.isSaving = false
      this.onStateChange?.()
      return false
    }
  }

  public load(): SaveData | null {
    try {
      const data = localStorage.getItem(this.SAVE_KEY)
      if (!data) return null
      return JSON.parse(data) as SaveData
    } catch (error) {
      console.error('게임 로드 중 오류 발생:', error)
      return null
    }
  }

  public hasSaveData(): boolean {
    if (localStorage.getItem(this.SAVE_KEY) !== null) {
      return !!this.load()?.roomId
    }

    return false
  }

  public clearSave(): void {
    localStorage.removeItem(this.SAVE_KEY)
  }
}
