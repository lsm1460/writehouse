import type { Tile } from '../Tile'
import { BlockTile } from './BlockTile'
import { FloorTile } from './FloorTile'
import { PushTile } from './PushTile'
import { Tile1 } from './Tile1'
import { Tile8 } from './Tile8'
import { Tilei } from './Tile_i'
import { TileE } from './TileE'
import { TileF } from './TileF'
import { TileG } from './TileG'
import { TileL } from './TileL'
import { TileS } from './TileS'
import { TileW } from './TileW'
import { TileWall } from './TileWall'

export function createTile(char: string, x: number, y: number, meta?: any): Tile {
  let tile: Tile

  switch (char) {
    case 'S':
      tile = new TileS(x, y)
      break
    case '#':
      tile = new TileWall(x, y)
      break
    case 'G':
      tile = new TileG(x, y)
      break
    case 'L':
      tile = new TileL(x, y)
      break
    case 'i':
      tile = new Tilei(x, y)
      break
    case 'F':
      tile = new TileF(char, x, y)
      break
    case 'f':
      tile = new TileF(char, x, y)
      break
    case 'W':
      tile = new TileW(char, x, y)
      break
    case 'w':
      tile = new TileW(char, x, y)
      break
    case 'E':
      tile = new TileE(x, y)
      break
    case '8':
      tile = new Tile8(x, y)
      break
    case '1':
      tile = new Tile1(x, y)
      break
    case 'I':
    case '_':
    case '=':
    case '≡':
    case 'O':
      tile = new PushTile(char, x, y)
      break
    case 'T':
    case 'H':
      tile = new BlockTile(char, x, y)
      break
    default:
      tile = new FloorTile(char, x, y) // '_', '.' 등등
  }

  if (meta) {
    tile.setData(meta)
  }

  return tile
}
