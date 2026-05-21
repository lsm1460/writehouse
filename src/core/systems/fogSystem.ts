import { EngineContext } from '../engineContext'
import type { LightSourceType, LightState } from '../types'

export class FogSystem {
  private litTiles: Map<string, LightState> = new Map()
  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public getLightState(x: number, y: number): LightState {
    return this.litTiles.get(`${x},${y}`) || { playerIntensity: 0, environmentIntensity: 0 }
  }

  public getLightLevel(x: number, y: number): number {
    const state = this.getLightState(x, y)
    return Math.max(state.playerIntensity, state.environmentIntensity)
  }

  public getEnvLightLevel(x: number, y: number): number {
    return this.getLightState(x, y).environmentIntensity
  }

  public update() {
    this.litTiles.clear()
    const grid = this.ctx.map.grid

    const playerPos = this.ctx.player.pos
    this.addLightZone(playerPos.x, playerPos.y, 2, 'PLAYER')

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x].char === 'L') {
          this.addLightZone(x, y, 3, 'ENVIRONMENT')
        }
      }
    }
  }

  private addLightZone(centerX: number, centerY: number, maxRange: number, type: LightSourceType) {
    for (let dy = -maxRange; dy <= maxRange; dy++) {
      for (let dx = -maxRange; dx <= maxRange; dx++) {
        const distance = Math.abs(dx) + Math.abs(dy)

        if (distance <= maxRange) {
          const targetX = centerX + dx
          const targetY = centerY + dy

          if (this.ctx.map.isValid(targetX, targetY)) {
            const key = `${targetX},${targetY}`
            const currentIntensity = maxRange - distance + 1

            // 기존 상태가 없으면 새로 생성, 있으면 가져옴
            const state = this.litTiles.get(key) || { playerIntensity: 0, environmentIntensity: 0 }

            if (type === 'PLAYER') {
              state.playerIntensity = Math.max(state.playerIntensity, currentIntensity)
            } else {
              state.environmentIntensity = Math.max(state.environmentIntensity, currentIntensity)
            }

            this.litTiles.set(key, state)
          }
        }
      }
    }
  }
}
