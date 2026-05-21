import { Tile } from '../Tile'

export class Tilei extends Tile {
  constructor(x: number, y: number) {
    super('i', x, y)
  }

  override canPick(): boolean {
    return false
  }

  override canMix(): boolean {
    return false
  }
}
