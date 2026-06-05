import { EngineContext } from '../engineContext'
import { createTile } from '../map/tiles'
import type { Direction, GridType, Position } from '../types'

export class PlayerSystem {
  public pos: Position = { x: 0, y: 0 }
  public lastX: number = 0
  public lastY: number = 0
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
    if (this.dir !== dir) {
      this.dir = dir
    }

    this.lastX = this.pos.x
    this.lastY = this.pos.y

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

      const behindEntity = this.ctx.entities?.[pushToY]?.[pushToX]
      if (behindEntity && ['M', 'm'].includes(behindEntity.char)) {
        return false
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
    this.ctx.onChange()

    return true
  }

  public checkEnvironmentEffects(grid: GridType, entities: any[][]): boolean {
    const { x: newX, y: newY } = this.pos

    const tile = grid[newY][newX]
    if (tile.char === 'f' || tile.isElectrified) return true

    const entity = entities[newY][newX]
    if (entity && ['M', 'm'].includes(entity.char)) return true

    if (this.lastX !== newX || this.lastY !== newY) {
      const entityAtOldPos = entities[this.lastY][this.lastX]
      if (entityAtOldPos && ['M', 'm'].includes(entityAtOldPos.char)) {
        const monsterLastX = entityAtOldPos.lastX ?? entityAtOldPos.x
        const monsterLastY = entityAtOldPos.lastY ?? entityAtOldPos.y
        if (monsterLastX === newX && monsterLastY === newY) return true
      }
    }

    return false
  }

  public spawn(pos: { x: number; y: number }) {
    this.pos = { ...pos }
    this.dir = 'UP'

    this.updateTargetPosition()
  }
}