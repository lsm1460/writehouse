import { DefaultTile, type TileEffect } from './tiles/DefaultTile'
import { FireTile } from './tiles/FireTile'
import { LightTile } from './tiles/LightTile'

interface TileMetadata {
  renderer: TileEffect
  skipRender?: boolean
  lightLevelOverride?: number
}

// 아무것도 그리지 않는 더미 렌더러 (skipRender용 백업)
const NullRenderer: TileEffect = { render() {} }

const registry: Record<string, TileMetadata> = {
  F: { renderer: FireTile},
  f: { renderer: FireTile},
  L: { renderer: LightTile},

  'i': { renderer: DefaultTile, lightLevelOverride: 9 },
  'G': { renderer: DefaultTile, lightLevelOverride: 9 },
  
  'O': { renderer: DefaultTile },
  
  'H': { renderer: NullRenderer, skipRender: true },
}

const defaultMetadata: TileMetadata = {
  renderer: DefaultTile,
}

export const TileRegistry = {
  getMetadata(char: string): TileMetadata {
    return registry[char] || defaultMetadata
  }
}