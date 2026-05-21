import { Tile } from '../Tile'

export class TileL extends Tile {
  constructor(x: number, y: number) {
    super('L', x, y)
  }

  override canMix(): boolean {
    return false
  }
}
