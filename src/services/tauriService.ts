import { getCurrentWindow } from '@tauri-apps/api/window'

export const isTauri = (): boolean => {
  //@ts-ignore
  return typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__
}

export const tauriService = {
  async showWindow(): Promise<void> {
    if (isTauri()) {
      const appWindow = getCurrentWindow()
      await appWindow.show()
    }
  },
  
  async exitGame(): Promise<void> {
    if (isTauri()) {
      const appWindow = getCurrentWindow()
      await appWindow.close()
    } else {
      console.log('[TauriService] 웹 브라우저 환경이므로 게임 종료를 시뮬레이션합니다.')
    }
  },

  async toggleFullscreen(fullscreen: boolean): Promise<void> {
    if (isTauri()) {
      const appWindow = getCurrentWindow()
      await appWindow.setFullscreen(fullscreen)
    }
  }
}