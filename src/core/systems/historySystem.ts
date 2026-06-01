import type { EngineContext } from '../engineContext'
import type { Direction, Position } from '../gameEngine'
import { createTile } from '../map/tiles'
import type { GridType } from '../types'
import type { InventoryItem } from './inventorySystem'

export interface HistoryState {
  grid: GridType
  playerPos: Position
  playerDir: Direction
  playerTargetPos: Position
  currentItem: InventoryItem | null
  turn: number
}

export class HistorySystem {
  private engine: EngineContext
  private history: HistoryState[] = []

  constructor(engine: EngineContext) {
    this.engine = engine
  }

  public captureState(): HistoryState {
    const gridCopy = this.engine.map.grid.map((row) =>
      row.map((tile) => {
        const cloned = createTile(tile.char, tile.x, tile.y, tile.getData())
        cloned.isWet = tile.isWet
        cloned.isElectrified = tile.isElectrified
        return cloned
      })
    )
    
    return {
      grid: gridCopy,
      playerPos: { ...this.engine.player.pos },
      playerDir: this.engine.player.dir,
      playerTargetPos: { ...this.engine.player.targetPos },
      currentItem: this.engine.inventory.currentItem ? { ...this.engine.inventory.currentItem } : null,
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
    this.engine.player.pos = previousState.playerPos
    this.engine.player.dir = previousState.playerDir
    this.engine.player.targetPos = previousState.playerTargetPos
    this.engine.inventory.currentItem = previousState.currentItem
    this.engine.turn = previousState.turn

    return true
  }

  public isStateChanged(s1: HistoryState, s2: HistoryState): boolean {
    if (s1.playerPos.x !== s2.playerPos.x || s1.playerPos.y !== s2.playerPos.y) return true
    if (s1.playerDir !== s2.playerDir) return true
    if (s1.currentItem?.char !== s2.currentItem?.char) return true

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
    return false
  }

  public clear() {
    this.history = []
  }
}