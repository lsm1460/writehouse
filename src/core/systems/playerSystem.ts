import { EngineContext } from '../engineContext'
import { createTile } from '../map/tiles'
import type { Direction, Position } from '../types'

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

  private calculateNextPosition(x: number, y: number, dir: Direction): Position {
    switch (dir) {
      case 'UP':
        return { x, y: y - 1 }
      case 'DOWN':
        return { x, y: y + 1 }
      case 'LEFT':
        return { x: x - 1, y }
      case 'RIGHT':
        return { x: x + 1, y }
    }
  }

  public updateTargetPosition() {
    this.targetPos = this.calculateNextPosition(this.pos.x, this.pos.y, this.dir)
  }

  public move(dir: Direction): boolean {
    if (this.dir !== dir) {
      this.dir = dir
    }

    this.lastX = this.pos.x
    this.lastY = this.pos.y

    const { x: nextX, y: nextY } = this.calculateNextPosition(this.pos.x, this.pos.y, dir)

    if (!this.tryPushObject(nextX, nextY, dir)) {
      return false
    }

    if (!this.tryWalkTo(nextX, nextY)) {
      return false
    }

    this.updateTargetPosition()
    this.ctx.updateFogAndNotify()
    return true
  }

  private tryPushObject(nextX: number, nextY: number, dir: Direction): boolean {
    const targetTile = this.ctx.getTileAt(nextX, nextY)

    if (!targetTile || !targetTile.isPushable) {
      return true
    }

    const { x: pushToX, y: pushToY } = this.calculateNextPosition(nextX, nextY, dir)

    if (this.ctx.getMonsterAt(pushToX, pushToY)) {
      return false
    }

    const behindTile = this.ctx.getTileAt(pushToX, pushToY)
    if (!behindTile) {
      return false
    }

    if (behindTile.char === ' ') {
      this.ctx.setTileAt(pushToX, pushToY, createTile(targetTile.char, pushToX, pushToY, { ...targetTile.getData() }))
      this.ctx.setTileAt(nextX, nextY, createTile(' ', nextX, nextY))
      return true
    }

    const mixedChar = targetTile.getMixedResult(behindTile.char)
    if (mixedChar) {
      this.ctx.setTileAt(pushToX, pushToY, createTile(mixedChar, pushToX, pushToY))
      this.ctx.setTileAt(nextX, nextY, createTile(' ', nextX, nextY))
      return true
    }

    return false
  }

  private tryWalkTo(nextX: number, nextY: number): boolean {
    if (!this.ctx.isWalkable(nextX, nextY)) {
      return false
    }

    this.pos = { x: nextX, y: nextY }

    const finalTile = this.ctx.getTileAt(nextX, nextY)
    if (finalTile?.char === 'G' && this.ctx.stageClear) {
      this.ctx.nextStage()
    }

    return true
  }

  public checkEnvironmentEffects(): boolean {
    const { x: newX, y: newY } = this.pos

    const tile = this.ctx.getTileAt(newX, newY)
    if (!tile) return false

    if (tile.char === 'f' || tile.isElectrified) return true
    if (this.ctx.getMonsterAt(newX, newY)) return true

    if (this.lastX !== newX || this.lastY !== newY) {
      const entityAtOldPos = this.ctx.getMonsterAt(this.lastX, this.lastY)
      if (entityAtOldPos) {
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
