import type { GameEngine } from '~/core/gameEngine'
import type { Camera } from '../Camera'
import type { RoomScript } from './index'

const delay = (ms: number, signal?: AbortSignal): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    const timer = setTimeout(() => {
      if (signal) signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)

    const onAbort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }

    if (signal) {
      signal.addEventListener('abort', onAbort)
    }
  })
}

export abstract class BaseRoomScript implements RoomScript {
  private abortController: AbortController | null = null
  private isRunningScenario = false

  protected abstract playScenario(engine: GameEngine, camera: Camera, wait: (ms: number) => Promise<void>): Promise<void>

  protected canStart(engine: GameEngine, camera: Camera): boolean {
    return true
  }

  public run(engine: GameEngine, camera: Camera) {
    if (!this.isRunningScenario && this.canStart(engine, camera)) {
      this.isRunningScenario = true
      this.abortController = new AbortController()
      
      const signal = this.abortController.signal
      const wait = (ms: number) => delay(ms, signal)

      this.playScenario(engine, camera, wait).catch((error) => {
        if (error.name !== 'AbortError') {
          console.error(error)
        }
      })
    }
  }

  public cleanup(camera: Camera) {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
    this.isRunningScenario = false
    camera.resetOffset()
  }
}
