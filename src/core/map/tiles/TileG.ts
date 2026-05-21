import { Tile } from '../Tile'

export class TileG extends Tile {
  constructor(x: number, y: number) {
    super('G', x, y)
  }

  override canPick(): boolean {
    return false
  }

  override canMix(): boolean {
    return false
  }
}
