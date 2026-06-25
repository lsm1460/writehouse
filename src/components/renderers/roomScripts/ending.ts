import { BaseRoomScript } from './base'
import type { GameEngine } from '~/core/gameEngine'
import type { Camera } from '../Camera'

class EndingScript extends BaseRoomScript {
  protected canStart(engine: GameEngine): boolean {
    const { player } = engine.ctx
    return player.pos.x === 9 && player.pos.y === 14
  }

  protected async playScenario(engine: GameEngine, camera: Camera, wait: (ms: number) => Promise<void>): Promise<void> {
    engine.togglePause()

    await wait(1500)
    engine.ctx.tickTurn()
    camera.setZoom((prev) => prev - 0.5, { animate: true })

    await wait(1500)
    engine.ctx.tickTurn()
    camera.setZoom((prev) => prev - 0.8, { animate: true })

    await wait(1500)
    engine.ctx.tickTurn()
    camera.setZoom((prev) => prev - 1.2, { animate: true })

    await wait(1500)
    engine.ctx.tickTurn()
    camera.setCameraYOffset(-300, { duration: 3000 })
    camera.setZoom((prev) => prev - 2, { animate: true })

    await wait(3000)
    camera.setCameraYOffset(-800, { duration: 6000 })

    await wait(6000)

    engine.ctx.nextStage()
  }
}

export const ending = new EndingScript()
