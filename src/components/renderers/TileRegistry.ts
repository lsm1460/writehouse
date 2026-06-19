import { AshpanTile } from './tiles/AshpanTile'
import { BeaconTile } from './tiles/BeaconTile'
import { BaseTileEffect, DefaultTile } from './tiles/DefaultTile'
import { DetectorTile } from './tiles/DetectorTile'
import { EnergyTile } from './tiles/EnergyTile'
import { FireTile } from './tiles/FireTile'
import { GoalTile } from './tiles/GoalTile'
import { GrassTile } from './tiles/GrassTile'
import { LightTile } from './tiles/LightTile'
import { OilTile } from './tiles/OilTile'
import { TreeTile } from './tiles/TreeTile'
import { WaterTile } from './tiles/WaterTile'
import { WPTTile } from './tiles/WPTTile'

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
const energyTile = new EnergyTile()
const detectorTile = new DetectorTile()
const treeTile = new TreeTile()
const oilTile = new OilTile()
const ashpanTile = new AshpanTile()
const wptTile = new WPTTile()

const nullTile = new NullTile()

const registry: Record<string, TileMetadata> = {
  L: { renderer: lightTile },
  G: { renderer: goalTile, lightLevelOverride: 9 },
  g: { renderer: grassTile },
  T: { renderer: treeTile },
  i: { renderer: beaconTile, lightLevelOverride: 9 },
  F: { renderer: fireTile },
  f: { renderer: fireTile },
  w: { renderer: waterTile },
  W: { renderer: waterTile },
  E: { renderer: energyTile },
  1: { renderer: energyTile },
  8: { renderer: energyTile },
  O: { renderer: oilTile },
  A: { renderer: ashpanTile },

  D: { renderer: detectorTile },
  Э: { renderer: wptTile },

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
