import { BeaconTile } from './tiles/BeaconTile'
import { BaseTileEffect, DefaultTile } from './tiles/DefaultTile'
import { FireTile } from './tiles/FireTile'
import { GoalTile } from './tiles/GoalTile'
import { GrassTile } from './tiles/GrassTile'
import { LightTile } from './tiles/LightTile'
import { WaterTile } from './tiles/WaterTile'

interface TileMetadata {
  renderer: BaseTileEffect
  skipRender?: boolean
  lightLevelOverride?: number
}

class NullTile extends BaseTileEffect {
  protected render() {}
}

const fireTile = new FireTile()
const lightTile = new LightTile()
const beaconTile = new BeaconTile()
const goalTile = new GoalTile()
const defaultTile = new DefaultTile()
const grassTile = new GrassTile()
const waterTile = new WaterTile()

const nullTile = new NullTile()

const registry: Record<string, TileMetadata> = {
  F: { renderer: fireTile },
  f: { renderer: fireTile },
  L: { renderer: lightTile },

  i: { renderer: beaconTile, lightLevelOverride: 9 },
  G: { renderer: goalTile, lightLevelOverride: 9 },
  g: { renderer: grassTile },
  w: { renderer: waterTile },
  W: { renderer: waterTile },

  O: { renderer: defaultTile },

  H: { renderer: nullTile, skipRender: true },
}

const defaultMetadata: TileMetadata = {
  renderer: defaultTile,
}

export const TileRegistry = {
  getMetadata(char: string): TileMetadata {
    return registry[char] || defaultMetadata
  },
}
