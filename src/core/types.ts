import type { Tile } from "./map/Tile"
import type { IMonsterTile } from "./map/tiles/types"

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export interface Position {
  x: number
  y: number
}

// 주입받을 맵 데이터 구조 정의
export interface RoomData {
  room_id: string
  title: string
  grid: string[][]
}

export interface MapData {
  floors: {
    floor_number: number
    title: string
    rooms: RoomData[]
  }[]
}

export type LightSourceType = 'PLAYER' | 'ENVIRONMENT'

export interface LightState {
  playerIntensity: number
  environmentIntensity: number
}

export type GridType = Tile[][]
export type EntitiesType = (IMonsterTile | null)[][]