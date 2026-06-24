import { EngineContext } from '../engineContext'
import { createTile } from '../map/tiles'
import type { Direction, Position } from '../types'

export class PlayerSystem {
  public pos: Position = { x: 0, y: 0 }
  public lastX: number = 0
  public lastY: number = 0
  public dir: Direction = 'UP'
  public targetPos: Position = { x: 0, y: 0 }

  private wasBlocked: boolean = false
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
    this.ctx.sound.resumeContext().catch((err) => console.warn('오디오 컨텍스트 기동 실패:', err))

    if (this.dir !== dir) {
      this.dir = dir
      this.updateTargetPosition()
      this.wasBlocked = false
    }

    this.lastX = this.pos.x
    this.lastY = this.pos.y

    const { x: nextX, y: nextY } = this.calculateNextPosition(this.pos.x, this.pos.y, dir)

    const pushResult = this.tryPushObject(nextX, nextY, dir)

    if (pushResult === 'fail') {
      this.triggerBumpOnce()
      return false
    }

    if (!this.tryWalkTo(nextX, nextY)) {
      this.triggerBumpOnce()
      return false
    }

    this.wasBlocked = false

    this.updateTargetPosition()
    this.ctx.updateFogAndNotify()

    if (pushResult === 'mix') {
      this.ctx.sound.playSfx('mix')
    } else {
      this.ctx.sound.playSfx('move')
    }

    return true
  }

  private triggerBumpOnce(): void {
    if (!this.wasBlocked) {
      this.ctx.sound.playSfx('bump')
      this.wasBlocked = true
    }
  }

  private tryPushObject(nextX: number, nextY: number, dir: Direction): 'fail' | 'push' | 'mix' | 'none' {
    const targetTile = this.ctx.map.getTileAt(nextX, nextY)

    if (!targetTile || !targetTile.isPushable) {
      return 'none'
    }

    const { x: pushToX, y: pushToY } = this.calculateNextPosition(nextX, nextY, dir)

    if (this.ctx.map.getMonsterAt(pushToX, pushToY)) {
      return 'fail'
    }

    const behindTile = this.ctx.map.getTileAt(pushToX, pushToY)
    if (!behindTile) {
      return 'fail'
    }

    if (behindTile.char === ' ') {
      this.ctx.map.setTileAt(
        pushToX,
        pushToY,
        createTile(targetTile.char, pushToX, pushToY, { ...targetTile.getData() })
      )
      this.ctx.map.setTileAt(nextX, nextY, createTile(' ', nextX, nextY))
      return 'push'
    }

    const mixedChar = targetTile.getMixedResult(behindTile.char)
    if (mixedChar) {
      this.ctx.map.setTileAt(pushToX, pushToY, createTile(mixedChar, pushToX, pushToY))
      this.ctx.map.setTileAt(nextX, nextY, createTile(' ', nextX, nextY))
      return 'mix'
    }

    return 'fail'
  }

  private tryWalkTo(nextX: number, nextY: number): boolean {
    if (!this.ctx.map.isWalkable(nextX, nextY)) {
      return false
    }

    this.pos = { x: nextX, y: nextY }

    const finalTile = this.ctx.map.getTileAt(nextX, nextY)
    if (finalTile?.char === 'G' && this.ctx.stageClear) {
      this.ctx.nextStage()
    }

    return true
  }

  public checkEnvironmentEffects(): boolean {
    const { x: newX, y: newY } = this.pos

    const tile = this.ctx.map.getTileAt(newX, newY)
    if (!tile) return false

    if (tile.char === 'f' || tile.isElectrified) return true
    if (this.ctx.map.getMonsterAt(newX, newY)) return true

    if (this.lastX !== newX || this.lastY !== newY) {
      const entityAtOldPos = this.ctx.map.getMonsterAt(this.lastX, this.lastY)
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
