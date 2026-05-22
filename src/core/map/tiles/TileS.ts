import { WalkableTile } from './types'

export class TileS extends WalkableTile {
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
}
