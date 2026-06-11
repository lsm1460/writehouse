import { CARDINAL_DIRECTIONS } from '~/core/consts'
import type { GridType } from '~/core/types'
import { Tile } from '../Tile'
import { PushTile } from './PushTile'
import { type IElectricTile, type IEnvironmentTile } from './types'

export abstract class EnergyTile extends PushTile implements IEnvironmentTile {
  constructor(char: string, x: number, y: number) {
    super(char, x, y)
  }

  public abstract get hasEnergy(): boolean

  public abstract onEnvironmentUpdate(deltaTime: number, grid: GridType): boolean

  public propagatePower(grid: GridType): boolean {
    if (!this.hasEnergy) return false

    return this.traverseNetwork(grid, (tile) => {
      if ('isElectric' in tile && (tile as unknown as IElectricTile).isElectric) {
        return (tile as unknown as IElectricTile).setPower(true)
      }

      if (tile.isWet) {
        tile.charge()
        return true
      }

      return false
    })
  }

  private traverseNetwork(grid: GridType, visitor: (tile: Tile) => boolean): boolean {
    let anyStateChanged = false

    const queue: Array<{ x: number; y: number }> = [{ x: this.x, y: this.y }]
    const visited = new Set<string>()
    visited.add(`${this.x},${this.y}`)

    while (queue.length > 0) {
      const current = queue.shift()!

      for (const [dx, dy] of CARDINAL_DIRECTIONS) {
        const nx = current.x + dx
        const ny = current.y + dy
        const key = `${nx},${ny}`

        if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[ny].length) {
          continue
        }

        if (visited.has(key)) {
          continue
        }

        const targetTile = grid[ny][nx]
        const isElectric = 'isElectric' in targetTile && (targetTile as unknown as IElectricTile).isElectric
        const isWetTile = targetTile.isWet

        if (isElectric || isWetTile) {
          visited.add(key)

          if (visitor(targetTile)) {
            anyStateChanged = true
          }

          queue.push({ x: nx, y: ny })
        }
      }
    }

    return anyStateChanged
  }
}
