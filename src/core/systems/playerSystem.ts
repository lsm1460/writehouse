import { EngineContext } from '../engineContext'
import { createTile } from '../map/tiles'
import type { Direction, GridType, Position } from '../types'
import { isOutOfBounds } from '../utils/grid'

export class PlayerSystem {
  public pos: Position = { x: 0, y: 0 }
  public dir: Direction = 'UP'
  public targetPos: Position = { x: 0, y: 0 }
  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
    this.initPosition()
    this.updateTargetPosition()
  }

  private initPosition() {
    const grid = this.ctx.map.grid
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x]?.isStart) {
          // 옵셔널 체이닝 추가 (벽 null 대응)
          this.pos = { x, y }
          return
        }
      }
    }
  }

  public updateTargetPosition() {
    const { x, y } = this.pos
    switch (this.dir) {
      case 'UP':
        this.targetPos = { x, y: y - 1 }
        break
      case 'DOWN':
        this.targetPos = { x, y: y + 1 }
        break
      case 'LEFT':
        this.targetPos = { x: x - 1, y }
        break
      case 'RIGHT':
        this.targetPos = { x: x + 1, y }
        break
    }
  }

  public move(dir: Direction) {
    // 1. 방향이 다르면 방향만 전환
    if (this.dir !== dir) {
      this.dir = dir
      this.updateTargetPosition()
      this.ctx.onChange()
      return false
    }

    let nextX = this.pos.x
    let nextY = this.pos.y

    switch (dir) {
      case 'UP':
        nextY -= 1
        break
      case 'DOWN':
        nextY += 1
        break
      case 'LEFT':
        nextX -= 1
        break
      case 'RIGHT':
        nextX += 1
        break
    }

    const grid = this.ctx.map.grid
    const targetTile = grid[nextY]?.[nextX]

    if (targetTile && targetTile.isPushable) {
      let pushToX = nextX
      let pushToY = nextY

      switch (dir) {
        case 'UP':
          pushToY -= 1
          break
        case 'DOWN':
          pushToY += 1
          break
        case 'LEFT':
          pushToX -= 1
          break
        case 'RIGHT':
          pushToX += 1
          break
      }

      const behindTile = grid[pushToY]?.[pushToX]

      if (behindTile && behindTile !== null) {
        if (behindTile.char === ' ') {
          grid[pushToY][pushToX] = createTile(targetTile.char, pushToX, pushToY, { ...targetTile.getData() })
          grid[nextY][nextX] = createTile(' ', nextX, nextY)
        } else {
          const mixedChar = targetTile.getMixedResult(behindTile.char)

          if (mixedChar) {
            grid[pushToY][pushToX] = createTile(mixedChar, pushToX, pushToY)
            grid[nextY][nextX] = createTile(' ', nextX, nextY)
          } else {
            return false
          }
        }
      } else {
        return false
      }
    }

    if (this.ctx.map.isWalkable(nextX, nextY)) {
      this.pos = { x: nextX, y: nextY }

      const finalTile = grid[nextY]?.[nextX]
      if (finalTile?.char === 'G' && this.ctx.stageClear) {
        this.ctx.nextStage()
        return true
      }
    } else {
      return false
    }

    this.ctx.fog.update()
    this.updateTargetPosition()
    this.ctx.onChange()

    return true
  }

  public checkEnvironmentEffects(grid: GridType): boolean {
    const { x, y } = this.pos

    if (isOutOfBounds(x, y, grid)) {
      return false
    }

    const currentTile = grid[y][x]
    if (!currentTile || currentTile === null) return false

    if (currentTile.char === 'f') {
      return true
    }

    if (currentTile.isElectrified) {
      return true
    }

    return false
  }
}
