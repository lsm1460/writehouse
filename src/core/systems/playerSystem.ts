import { EngineContext } from '../engineContext'
import type { Direction, Position } from '../types'

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
        if (grid[y][x].isStart) {
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

    if (this.ctx.map.isWalkable(nextX, nextY)) {
      this.pos = { x: nextX, y: nextY }

      const targetTile = this.ctx.map.grid[nextY]?.[nextX]
      if (targetTile?.char === 'G' && this.ctx.stageClear) {
        this.ctx.nextStage()
        return
      }
    }

    this.ctx.fog.update()
    this.updateTargetPosition()
    this.ctx.onChange()

    return true
  }
}
