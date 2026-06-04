import type { EngineContext } from '../engineContext'

export interface DeathEvent {
  x: number
  y: number
  char: string
  reason: 'FIRE' | 'ELECTRICITY'
}

export class EffectSystem {
  private ctx: EngineContext
  public deathEvents: DeathEvent[] = []

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public recordDeath(event: DeathEvent) {
    this.deathEvents.push(event)
  }

  public clear() {
    this.deathEvents = []
  }
}
