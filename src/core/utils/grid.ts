import type { GridType } from '~/core/types'

export function isOutOfBounds(x: number, y: number, grid: GridType): boolean {
  return y < 0 || y >= grid.length || x < 0 || x >= grid[y].length
}