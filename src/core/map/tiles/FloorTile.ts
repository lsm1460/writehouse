import { WalkableTile } from './types'

export class FloorTile extends WalkableTile {
  constructor(char: string, x: number, y: number) {
    super(char, x, y)
  }
}
