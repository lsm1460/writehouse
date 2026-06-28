import type { EngineContext } from '../engineContext'
import type { Direction, Position } from '../gameEngine'
import { createTile } from '../map/tiles'
import type { EntitiesType, GridType } from '../types'

export interface HistoryState {
  roomId: string
  grid: GridType
  entities: EntitiesType
  playerPos: Position
  playerDir: Direction
  playerTargetPos: Position
  turn: number
}

export class HistorySystem {
  private engine: EngineContext
  private history: HistoryState[] = []

  constructor(engine: EngineContext) {
    this.engine = engine
  }

  public captureState(): HistoryState {
    // 1. 타일 그리드 복사
    const gridCopy = this.engine.map.grid.map((row) =>
      row.map((tile) => {
        const cloned = createTile(tile.char, tile.x, tile.y, tile.getData())
        cloned.isWet = tile.isWet
        cloned.isElectrified = tile.isElectrified
        return cloned
      })
    )

    const entitiesCopy = this.engine.map.entities.map((row) =>
      row.map((entity) => {
        if (!entity) return null

        const cloned = Object.assign(Object.create(Object.getPrototypeOf(entity)), entity)

        if (cloned.pos) cloned.pos = { ...cloned.pos }

        return cloned
      })
    )

    return {
      roomId: this.engine.map.currentRoomId,
      grid: gridCopy,
      entities: entitiesCopy, // 💡 캡처 데이터에 추가
      playerPos: { ...this.engine.player.pos },
      playerDir: this.engine.player.dir,
      playerTargetPos: { ...this.engine.player.targetPos },
      turn: this.engine.turn,
    }
  }

  public pushState(state: HistoryState) {
    this.history.push(state)
  }

  public undo(): boolean {
    if (this.history.length === 0) return false

    const previousState = this.history.pop()
    if (!previousState) return false

    this.engine.map.grid = previousState.grid
    this.engine.map.entities = previousState.entities
    this.engine.player.pos = previousState.playerPos
    this.engine.player.dir = previousState.playerDir
    this.engine.player.targetPos = previousState.playerTargetPos
    this.engine.turn = previousState.turn

    return true
  }

  public isStateChanged(s1: HistoryState, s2: HistoryState): boolean {
    if (s1.roomId !== s2.roomId) return false

    if (s1.playerPos.x !== s2.playerPos.x || s1.playerPos.y !== s2.playerPos.y) return true
    if (s1.playerDir !== s2.playerDir) return true

    // 타일 변경 사항 체크
    if (s1.grid.length !== s2.grid.length) return true
    for (let y = 0; y < s1.grid.length; y++) {
      if (s1.grid[y].length !== s2.grid[y].length) return true
      for (let x = 0; x < s1.grid[y].length; x++) {
        const t1 = s1.grid[y][x]
        const t2 = s2.grid[y][x]
        if (t1.char !== t2.char) return true
        if (t1.isWet !== t2.isWet) return true
        if (t1.isElectrified !== t2.isElectrified) return true
      }
    }

    if (s1.entities.length !== s2.entities.length) return true
    for (let y = 0; y < s1.entities.length; y++) {
      if (s1.entities[y].length !== s2.entities[y].length) return true
      for (let x = 0; x < s1.entities[y].length; x++) {
        const e1 = s1.entities[y][x]
        const e2 = s2.entities[y][x]

        if ((e1 && !e2) || (!e1 && e2)) return true
        if (e1 && e2) {
          if (e1.char !== e2.char) return true
          if (e1.x !== e2.x || e1.y !== e2.y) return true
        }
      }
    }

    return false
  }

  public clear() {
    this.history = []
  }
}
