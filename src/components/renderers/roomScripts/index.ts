import type { GameEngine } from '~/core/gameEngine'
import type { Camera } from '../Camera'
import { ending } from './ending'
import { final } from './final'

export interface RoomScript {
  run: (engine: GameEngine, camera: Camera) => void
  cleanup?: (camera: Camera) => void
}

export const roomScripts: Record<string, RoomScript[]> = {
  '6-1': [final, ending],
}