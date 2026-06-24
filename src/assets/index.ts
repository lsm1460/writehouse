import mapData from './map.json'
import soundData from './sounds/sounds.json'

export const assets = {
  map: mapData,
  sound: soundData,
}

export type AssetsType = {
  map: typeof assets.map;
} & Partial<Pick<typeof assets, 'sound'>>;