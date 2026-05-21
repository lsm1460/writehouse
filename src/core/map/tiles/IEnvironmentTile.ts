import type { GridType } from '~/core/types'

export interface IEnvironmentTile {
  onEnvironmentUpdate(deltaTime: number, mapSystem: GridType): boolean
}

export function isEnvironmentTile(tile: any): tile is IEnvironmentTile {
  return tile && typeof (tile as any).onEnvironmentUpdate === 'function'
}
