import { Tile } from '../Tile'

export class TileWall extends Tile {
  constructor(x: number, y: number) {
    super('#', x, y)
  }

  override get isWalkable(): boolean {
    return false
  }

  override canPick(): boolean {
    return false
  }

  override canMix(): boolean {
    return false
  }
}
