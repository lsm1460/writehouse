import { Tile } from '../Tile'

export class TileS extends Tile {
  public isStart = true

  constructor(x: number, y: number) {
    super('S', x, y)
  }

  override get char(): string {
    return ''
  }

  override canPick(): boolean {
    return false
  }
  
  override canMix(): boolean {
    return false
  }
}
