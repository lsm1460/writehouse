import { CARDINAL_DIRECTIONS } from '~/core/consts'
import type { EntitiesType, GridType } from '~/core/types'
import { EnergyTile } from './EnergyTile'
import { isMonsterTile } from './types'

export class TileD extends EnergyTile {
  private _hasEnergy: boolean = false

  constructor(x: number, y: number) {
    super('D', x, y)
  }

  override get lightRadius() {
    return 1
  }

  override get hasEnergy(): boolean {
    return this._hasEnergy
  }

  onEnvironmentUpdate() {
    return false
  }

  override propagatePower(grid: GridType, entities?: EntitiesType): boolean {
    let monsterDetected = false

    for (const [dx, dy] of CARDINAL_DIRECTIONS) {
      const nx = this.x + dx
      const ny = this.y + dy
      if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length) {
        const tile = grid[ny][nx]
        if (isMonsterTile(tile)) {
          monsterDetected = true
          break
        }
        if (entities && entities[ny]) {
          const entity = entities[ny][nx]
          if (isMonsterTile(entity)) {
            monsterDetected = true
            break
          }
        }
      }
    }

    if (!monsterDetected) {
      this._hasEnergy = false

      return false
    }

    this._hasEnergy = true
    console.log('monsterDetected',monsterDetected)
    return super.propagatePower(grid)
  }
}
