import { COMPASS_DIRECTIONS } from '~/core/consts'
import type { GridType } from '~/core/types'
import { isOutOfBounds } from '~/core/utils/grid'
import { Tile } from '../Tile'
import { type IEnvironmentTile, WalkableTile } from './types'

export class TileF extends Tile implements IEnvironmentTile {
  public fireStage: 'STRONG' | 'WEAK' | 'EXTINGUISHED' = 'STRONG'
  public age: number = 0
  private isInitialTurn: boolean = true

  private readonly FIRE_LIFETIME = 4

  constructor(char: string, x: number, y: number) {
    super(char, x, y)
  }

  override get isWalkable(): boolean {
    return this.char !== 'F'
  }

  override get lightRadius() {
    if (this.char === 'F') return 2
    if (this.char === 'f') return 1
    return 0
  }

  public onEnvironmentUpdate(deltaTime: number, grid: GridType): boolean {
    if (this.fireStage === 'EXTINGUISHED') return false

    let hasChanged = false

    if (this.isInitialTurn) {
      this.isInitialTurn = false
      return false
    }

    if (this.checkAdjacentOil(grid)) {
      if (this.fireStage === 'WEAK') {
        this.reignite()
        hasChanged = true // 상태가 변했음을 기록
      }
    } else {
      this.age += deltaTime
      if (this.age >= this.FIRE_LIFETIME) {
        this.degrade()
        return true
      }
    }

    const spreadSuccess = this.spreadFire(grid)

    return hasChanged || spreadSuccess
  }

  private spreadFire(grid: GridType): boolean {
    let spreadSuccess = false

    for (const [dx, dy] of COMPASS_DIRECTIONS) {
      const nx = this.x + dx
      const ny = this.y + dy

      if (isOutOfBounds(nx, ny, grid)) continue

      const targetTile = grid[ny][nx]

      if (targetTile instanceof WalkableTile) {
        const wasWet = targetTile.isWet
        targetTile.dry()

        if (wasWet) {
          spreadSuccess = true
          continue
        }
      }

      if (targetTile.char === 'T' || targetTile.char === 'g') {
        grid[ny][nx] = this.createSpreadFireTile(targetTile.char, nx, ny)
        spreadSuccess = true
      }
    }

    return spreadSuccess
  }

  private checkAdjacentOil(grid: GridType): boolean {
    return COMPASS_DIRECTIONS.some(([dx, dy]) => {
      const nx = this.x + dx
      const ny = this.y + dy
      return !isOutOfBounds(nx, ny, grid) && grid[ny][nx].char === 'O'
    })
  }

  private createSpreadFireTile(targetChar: string, x: number, y: number): TileF {
    const isTree = targetChar === 'T'
    const stage = isTree ? 'STRONG' : 'WEAK'
    const char = isTree ? 'F' : 'f'

    const newFire = new TileF(char, x, y)
    newFire.fireStage = stage
    return newFire
  }

  private degrade() {
    if (this.fireStage === 'STRONG') {
      this.fireStage = 'WEAK'
      this.setChar('f')
    } else if (this.fireStage === 'WEAK') {
      this.fireStage = 'EXTINGUISHED'
      this.setChar(' ')
    }
    this.age = 0
  }

  private reignite() {
    this.age = 0
  }
}
