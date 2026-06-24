import type { EngineContext } from '../engineContext'
import { isEnvironmentTile, type IEnvironmentTile } from '../map/tiles/types'
import { DoorSystem } from '../systems/DoorSystem'
import { ElectricitySystem } from '../systems/ElectricitySystem'
import { FireSpreadingSystem } from '../systems/FireSpreadingSystem'
import { MonsterMovementSystem } from '../systems/MonsterMovementSystem'
import { WaterSpreadingSystem } from '../systems/WaterSpreadingSystem'

export class EnvironmentManager {
  private ctx: EngineContext
  private electricitySystem: ElectricitySystem
  // private fireSystem: FireSpreadingSystem
  private monsterSystem: MonsterMovementSystem
  private waterSystem: WaterSpreadingSystem
  private doorSystem: DoorSystem

  constructor(ctx: EngineContext) {
    this.ctx = ctx
    this.electricitySystem = new ElectricitySystem(ctx)
    // this.fireSystem = new FireSpreadingSystem(ctx)
    this.monsterSystem = new MonsterMovementSystem(ctx)
    this.waterSystem = new WaterSpreadingSystem(ctx)
    this.doorSystem = new DoorSystem(ctx)
  }

  public update(deltaTime: number): boolean {
    const grid = this.ctx.map.grid
    let hasAnyTileChanged = false

    this.electricitySystem.reset(grid)

    if (this.updateEnvironmentTiles(deltaTime)) hasAnyTileChanged = true

    if (this.monsterSystem.update(grid)) hasAnyTileChanged = true

    // if (this.fireSystem.update(deltaTime, grid)) hasAnyTileChanged = true
    if (this.electricitySystem.update()) hasAnyTileChanged = true
    if (this.doorSystem.update()) hasAnyTileChanged = true

    if (this.waterSystem.update(deltaTime, grid)) hasAnyTileChanged = true

    return hasAnyTileChanged
  }

  private updateEnvironmentTiles(deltaTime: number): boolean {
    const grid = this.ctx.map.grid

    let changed = false
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x]
        if (isEnvironmentTile(tile)) {
          if ((tile as IEnvironmentTile).onEnvironmentUpdate(deltaTime, grid)) {
            changed = true
          }
        }
      }
    }
    return changed
  }
}
