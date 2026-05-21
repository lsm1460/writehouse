import type { Tile } from '../Tile'
import { FloorTile } from './FloorTile'
import { TileF } from './TileF'
import { TileG } from './TileG'
import { Tilei } from './Tilei'
import { TileL } from './TileL'
import { TileS } from './TileS'
import { TileT } from './TileT'
import { TileWall } from './TileWall'

export function createTile(char: string, x: number, y: number): Tile {
  switch (char) {
    case 'S':
      return new TileS(x, y)
    case '#':
      return new TileWall(x, y)
    case 'G':
      return new TileG(x, y)
    case 'L':
      return new TileL(x, y)
    case 'i':
      return new Tilei(x, y)
    case 'F':
      return new TileF(char, x, y)
    case 'f':
      return new TileF(char, x, y)
    case 'T':
      return new TileT(x, y)
    default:
      return new FloorTile(char, x, y) // '_', 'I', '.' 등등
  }
}
