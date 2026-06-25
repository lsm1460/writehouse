import { BaseRoomScript } from './base'
import type { GameEngine } from '~/core/gameEngine'
import type { Camera } from '../Camera'

class FinalScript extends BaseRoomScript {
  protected canStart(engine: GameEngine): boolean {
    return true
  }

  protected async playScenario(engine: GameEngine, camera: Camera, wait: (ms: number) => Promise<void>): Promise<void> {
    camera.setZoom(3.5)
  }
}

export const final = new FinalScript()
