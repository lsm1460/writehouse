import { COMPASS_DIRECTIONS } from '~/core/consts'
import type { GridType } from '~/core/types'
import { Tile } from '../Tile'
import { type IEnvironmentTile, IElectricTile } from './types'

export abstract class EnergyTile extends Tile implements IEnvironmentTile {
  constructor(char: string, x: number, y: number) {
    super(char, x, y)
  }

  public abstract get hasEnergy(): boolean

  public abstract onEnvironmentUpdate(deltaTime: number, grid: GridType): boolean

  protected propagatePower(grid: GridType): boolean {
    let anyWireChanged = false

    const queue: Array<{ x: number; y: number }> = [{ x: this.x, y: this.y }]
    const visited = new Set<string>()
    visited.add(`${this.x},${this.y}`)

    while (queue.length > 0) {
      const current = queue.shift()!

      for (const [dx, dy] of COMPASS_DIRECTIONS) {
        const nx = current.x + dx
        const ny = current.y + dy
        const key = `${nx},${ny}`

        if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length) {
          if (visited.has(key)) continue

          const targetTile = grid[ny][nx]
          if (targetTile instanceof IElectricTile) {
            visited.add(key)

            const isChanged = targetTile.setPower(true)
            if (isChanged) {
              anyWireChanged = true
            }

            queue.push({ x: nx, y: ny })
          }
        }
      }
    }

    return anyWireChanged
  }

  protected clearConnectedWires(grid: GridType) {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] instanceof IElectricTile) {
          ;(grid[y][x] as IElectricTile).resetPower()
        }
      }
    }
  }

  override onDestroy(grid: GridType): void {
    this.clearConnectedWires(grid)
  }
}
