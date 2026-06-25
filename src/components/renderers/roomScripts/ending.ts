import { BaseRoomScript } from './base'
import type { GameEngine } from '~/core/gameEngine'
import type { Camera } from '../Camera'

class EndingScript extends BaseRoomScript {
  protected canStart(engine: GameEngine): boolean {
    const { player } = engine.ctx
    // return player.pos.x === 5 && player.pos.y === 2

    return false
  }

  protected async playScenario(engine: GameEngine, camera: Camera, wait: (ms: number) => Promise<void>): Promise<void> {
    engine.togglePause()

    await wait(5000)
    engine.ctx.tickTurn()
    engine.ctx.nextStage()
  }
}

export const ending = new EndingScript()
