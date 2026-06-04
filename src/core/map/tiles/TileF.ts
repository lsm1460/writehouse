import { Tile } from '../Tile'

export class TileF extends Tile {
  // 시스템이 직접 조회하고 수정할 수 있도록 public으로 개방
  public fireStage: 'STRONG' | 'WEAK' | 'EXTINGUISHED' = 'STRONG'
  public age: number = 0
  public isInitialTurn: boolean = true

  public readonly FIRE_LIFETIME = 4

  constructor(char: string, x: number, y: number) {
    super(char, x, y)
  }

  override getData() {
    return {
      fireStage: this.fireStage,
      age: this.age,
      isInitialTurn: this.isInitialTurn,
    }
  }

  override setData(data: any) {
    if (data) {
      if (typeof data.fireStage === 'string') this.fireStage = data.fireStage
      if (typeof data.age === 'number') this.age = data.age
      if (typeof data.isInitialTurn === 'boolean') this.isInitialTurn = data.isInitialTurn
    }
  }

  override get isWalkable(): boolean {
    return this.char !== 'F'
  }

  override get lightRadius() {
    if (this.char === 'F') return 2
    if (this.char === 'f') return 1
    return 0
  }

  public degrade() {
    if (this.fireStage === 'STRONG') {
      this.fireStage = 'WEAK'
      this.setChar('f')
    } else if (this.fireStage === 'WEAK') {
      this.fireStage = 'EXTINGUISHED'
      this.setChar(' ')
    }
    this.age = 0
  }

  public reignite() {
    this.age = 0
  }
}
