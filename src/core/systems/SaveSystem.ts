export interface SaveData {
  roomId: string
  savedAt: string
}

export class SaveSystem {
  private readonly SAVE_KEY = 'write_house_save_data'

  public save(roomId: string): boolean {
    try {
      const saveData: SaveData = {
        roomId,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData))
      return true
    } catch (error) {
      console.error('게임 저장 중 오류 발생:', error)
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
    return localStorage.getItem(this.SAVE_KEY) !== null
  }

  public clearSave(): void {
    localStorage.removeItem(this.SAVE_KEY)
  }
}
