import type { GridType } from '../types'
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
    return false
  }

  get lightRadius() {
    return 0
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

  public onDestroy(grid: GridType): void {}

  public getData(): any {
    return null
  }

  public setData(data: any): void {}

  public getMixedResult(incomingChar: string): string | null {
    return getMixedChar(this._char, incomingChar)
  }

  public get isEmptyFloor(): boolean {
    return this._char.trim() === ''
  }
}
