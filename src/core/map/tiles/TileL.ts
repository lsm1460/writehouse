import { Tile } from '../Tile'

export class TileL extends Tile {
  constructor(x: number, y: number) {
    super('L', x, y)
  }

  override get isWalkable(): boolean {
    return false
  }
}
