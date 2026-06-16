import { CARDINAL_DIRECTIONS } from '~/core/consts'
import type { GridType } from '~/core/types'
import { IElectricTile } from './types'

export class TileWPT extends IElectricTile {
  constructor(x: number, y: number) {
    super('Э', x, y)
  }

  override get lightRadius() {
    return this._hasEnergy ? 1 : 0
  }

  public propagatePower(grid: GridType): boolean {
    if (!this.hasEnergy) return false

    let changed = false

    if (this.propagateWireless(grid)) {
      changed = true
    }

    if (this.propagateWires(grid)) {
      changed = true
    }

    return changed
  }

  private propagateWireless(grid: GridType): boolean {
    let changed = false
    const radius = 3

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx === 0 && dy === 0) continue
        if (Math.abs(dx) + Math.abs(dy) > radius) continue

        const nx = this.x + dx
        const ny = this.y + dy

        if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length) {
          const targetTile = grid[ny][nx]

          if (targetTile instanceof TileWPT) {
            if (targetTile.setPower(true)) {
              changed = true

              targetTile.propagatePower(grid)
            }
          }
        }
      }
    }
    return changed
  }

  private propagateWires(grid: GridType): boolean {
    let anyStateChanged = false

    const queue: Array<{ x: number; y: number }> = []
    const visited = new Set<string>()
    visited.add(`${this.x},${this.y}`)

    for (const [dx, dy] of CARDINAL_DIRECTIONS) {
      const nx = this.x + dx
      const ny = this.y + dy
      if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length) {
        queue.push({ x: nx, y: ny })
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!
      const key = `${current.x},${current.y}`

      if (visited.has(key)) continue
      visited.add(key)

      const targetTile = grid[current.y][current.x]

      if (targetTile instanceof TileWPT) continue

      const isElectric = 'isElectric' in targetTile && (targetTile as any).isElectric
      const isWetTile = (targetTile as any).isWet

      if (isElectric || isWetTile) {
        if (isElectric) {
          if ((targetTile as any).setPower(true)) {
            anyStateChanged = true
          }
        } else if (isWetTile && typeof (targetTile as any).charge === 'function') {
          ;(targetTile as any).charge()
          anyStateChanged = true
        }

        for (const [dx, dy] of CARDINAL_DIRECTIONS) {
          const nx = current.x + dx
          const ny = current.y + dy
          if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length) {
            queue.push({ x: nx, y: ny })
          }
        }
      }
    }

    return anyStateChanged
  }
}
