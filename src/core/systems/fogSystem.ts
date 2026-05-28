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
        // 기존 코드 구조상 grid[y][x]가 null(벽)일 수 있으므로 옵셔널 체이닝 추가
        const radius = grid[y]?.[x]?.lightRadius

        if (radius) {
          this.addLightZone(x, y, radius, 'ENVIRONMENT')
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
            // 광원 중심에서 대상 타일 사이에 벽이 있다면 시야(빛) 차단
            if (!this.isTileVisible(centerX, centerY, targetX, targetY)) {
              continue
            }

            const key = `${targetX},${targetY}`
            const currentIntensity = maxRange - distance + 1

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

  private isTileVisible(startX: number, startY: number, endX: number, endY: number): boolean {
    // 시작점과 끝점이 같으면 무조건 보임
    if (startX === endX && startY === endY) return true

    const dx = Math.abs(endX - startX)
    const dy = Math.abs(endY - startY)
    const sx = startX < endX ? 1 : -1
    const sy = startY < endY ? 1 : -1
    
    let err = dx - dy
    let currentX = startX
    let currentY = startY

    while (true) {
      // 목적지에 도달하기 전에 중간에 벽을 만났는지 확인
      // (목적지 타일 그 자체는 벽이더라도 빛이 표면에는 닿아야 하므로, 도착 직전 타일들만 검사)
      if ((currentX !== startX || currentY !== startY) && (currentX !== endX || currentY !== endY)) {
        if (this.isWall(currentX, currentY)) {
          return false // 중간에 벽이 있으므로 빛이 통과하지 못함
        }
      }

      if (currentX === endX && currentY === endY) break

      const e2 = 2 * err
      if (e2 > -dy) {
        err -= dy
        currentX += sx
      }
      if (e2 < dx) {
        err += dx
        currentY += sy
      }
    }

    return true
  }

  private isWall(x: number, y: number): boolean {
    const grid = this.ctx.map.grid
    
    return !grid[y] || !grid[y][x] || ['#', 'T'].includes( grid[y][x].char)
  }
}