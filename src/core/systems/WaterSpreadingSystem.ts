import type { GridType } from '~/core/types'
import type { EngineContext } from '../engineContext'

export class WaterSpreadingSystem {
  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public update(deltaTime: number, grid: GridType): boolean {
    return false
  }
}
