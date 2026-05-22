import { COMPASS_DIRECTIONS } from '~/core/consts'
import type { GridType } from '~/core/types'
import { Tile } from '../Tile'
import type { IEnvironmentTile } from './types'

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
    if (this.char === 'F') {
      return 2
    } else if (this.char === 'f') {
      return 1
    }

    return 0
  }

  public onEnvironmentUpdate(deltaTime: number, grid: GridType): boolean {
    if (this.fireStage === 'EXTINGUISHED') return false

    let hasChanged = false
    const hasOil = this.checkAdjacentOil(grid)

    if (hasOil) {
      if (this.fireStage === 'WEAK') {
        this.reignite()
        hasChanged = true
      }
    } else {
      this.age += deltaTime
      if (this.age >= this.FIRE_LIFETIME) {
        this.degrade()
        return true
      }
    }

    if (this.isInitialTurn) {
      this.isInitialTurn = false
      return hasChanged
    }

    const didSpread = this.spreadFire(grid)
    if (didSpread) {
      hasChanged = true
    }

    return hasChanged
  }

  private spreadFire(grid: GridType): boolean {
    let spreadSuccess = false

    for (const [dx, dy] of COMPASS_DIRECTIONS) {
      const nx = this.x + dx
      const ny = this.y + dy

      if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length) {
        const targetTile = grid[ny][nx]

        if (targetTile.char === 'T') {
          const newFire = new TileF('F', nx, ny)
          newFire.fireStage = 'STRONG'
          newFire.setChar('F')

          grid[ny][nx] = newFire
          spreadSuccess = true
        } else if (targetTile.char === 'g') {
          const newFire = new TileF('f', nx, ny)
          newFire.fireStage = 'WEAK'
          newFire.setChar('f')

          grid[ny][nx] = newFire
          spreadSuccess = true
        }
      }
    }

    return spreadSuccess
  }

  private checkAdjacentOil(grid: GridType): boolean {
    for (const [dx, dy] of COMPASS_DIRECTIONS) {
      const nx = this.x + dx
      const ny = this.y + dy
      if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length) {
        if (grid[ny][nx].char === 'O') return true
      }
    }
    return false
  }

  private degrade() {
    if (this.fireStage === 'STRONG') {
      this.fireStage = 'WEAK'
      this.setChar('f')
      this.age = 0
    } else if (this.fireStage === 'WEAK') {
      this.fireStage = 'EXTINGUISHED'
      this.setChar(' ')
      this.age = 0
    }
  }

  private reignite() {
    this.age = 0
  }
}
