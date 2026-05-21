import { Tile } from '../Tile'

export class TileT extends Tile {
  constructor(x: number, y: number) {
    super('T', x, y)
  }

  override get isWalkable(): boolean {
    return false
  }
}
