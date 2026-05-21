import { isEnvironmentTile } from '../map/tiles/IEnvironmentTile'
import type { GridType } from '../types'

export class EnvironmentSystem {
  private mapGrid: GridType

  constructor(mapGrid: GridType) {
    this.mapGrid = mapGrid
  }

  public update(deltaTime: number): boolean {
    const grid = this.mapGrid
    let hasAnyTileChanged = false

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]

        if (isEnvironmentTile(tile)) {
          const isChanged = tile.onEnvironmentUpdate(deltaTime, this.mapGrid)
          if (isChanged) {
            hasAnyTileChanged = true
          }
        }
      }
    }

    return hasAnyTileChanged
  }
}