export class Tile {
  public isStart: boolean = false
  public _char: string
  public x: number
  public y: number

  constructor(char: string, x: number, y:number) {
    this._char = char
    this.x = x
    this.y = y
    
    this.isStart = char === 'S'
  }

  get char() {
    if (['S'].includes(this._char)) {
      return ''
    }

    return this._char
  }

  get isWalkable() {
    return this._char !== '#'
  }

  public setChar(char: string) {
    this._char = char
  }

  public toEmpty() {
    this._char = ''
  }

  public canPick() {
    return !['#', 'G'].includes(this._char)
  }

  public canMix() {
    return !['#', '$', 'L', 'B'].includes(this._char)
  }

  public mix(char: string) {
    const combined = [this._char, char].sort().join('')

    if (combined === 'I_') {
      this._char = 'L'

      return
    }

    console.log('char', char)
    this._char = char
  }
}
