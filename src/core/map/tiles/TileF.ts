import type { GridType } from '~/core/types'
import { Tile } from '../Tile'
import type { IEnvironmentTile } from './IEnvironmentTile'

export class TileF extends Tile implements IEnvironmentTile {
  public fireStage: 'STRONG' | 'WEAK' | 'EXTINGUISHED' = 'STRONG'
  public age: number = 0
  private spreadTimer: number = 0 // [추가] 불꽃 확산 주기 타이머 (초 단위)
  private readonly SPREAD_INTERVAL = 1.5 // 1.5초마다 한 번씩 주변으로 번짐

  constructor(char: string, x: number, y: number) {
    super(char, x, y)
  }

  override get isWalkable(): boolean {
    return this.char !== 'F'
  }

  public onEnvironmentUpdate(deltaTime: number, grid: GridType): boolean {
    if (this.fireStage === 'EXTINGUISHED') return false

    let hasChanged = false
    const hasOxygen = this.checkAdjacentOxygen(grid)

    if (hasOxygen) {
      if (this.fireStage === 'WEAK') {
        this.reignite()
        hasChanged = true
      }
    } else {
      this.age += deltaTime
      if (this.age >= 5.0) {
        this.degrade()
        return true // 상태가 변했으므로 즉시 리턴
      }
    }

    this.spreadTimer += deltaTime
    if (this.spreadTimer >= this.SPREAD_INTERVAL) {
      this.spreadTimer = 0 // 타이머 초기화

      const didSpread = this.spreadFire(grid)
      if (didSpread) {
        hasChanged = true
      }
    }

    return hasChanged
  }

  private spreadFire(grid: GridType): boolean {
    let spreadSuccess = false

    const directions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ]

    for (const [dx, dy] of directions) {
      const nx = this.x + dx
      const ny = this.y + dy

      // 맵 경계선 예외 처리
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

  private checkAdjacentOxygen(grid: GridType): boolean {
    const directions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ]
    for (const [dx, dy] of directions) {
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
    this.fireStage = 'STRONG'
    this.setChar('F')
    this.age = 0
  }
}
