import { Tile } from "../Tile";

export class PushTile extends Tile {
  constructor(char: string, x: number, y: number) {
    super(char, x, y)
  }

  get isPushable() {
    return true
  }
}
