import { getMixedChar } from './tiles/mixRecipes'

export abstract class Tile {
  public isStart: boolean = false
  public _char: string
  public x: number
  public y: number

  constructor(char: string, x: number, y: number) {
    this._char = char
    this.x = x
    this.y = y
  }

  get char(): string {
    return this._char
  }

  get isWalkable(): boolean {
    return true
  }

  public canPick(): boolean {
    return true
  }

  public canMix(): boolean {
    return true
  }

  public setChar(char: string) {
    this._char = char
  }

  public toEmpty() {
    this._char = ''
  }

  public mix(char: string) {
    // 1. 레시피 테이블에서 조합 결과가 있는지 확인
    const mixedResult = getMixedChar(this._char, char)

    if (mixedResult) {
      this._char = mixedResult
      return
    }

    this._char = char
  }
}
