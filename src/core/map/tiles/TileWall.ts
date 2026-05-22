import { Tile } from '../Tile'

export class TileWall extends Tile {
  constructor(x: number, y: number) {
    super('#', x, y)
  }

  override canPick(): boolean {
    return false
  }
}
