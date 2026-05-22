import { WalkableTile } from './types'

export class TileG extends WalkableTile {
  constructor(x: number, y: number) {
    super('G', x, y)
  }

  override canPick(): boolean {
    return false
  }
}
