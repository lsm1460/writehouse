import type { EngineContext } from '../engineContext'
import type { GridType } from '~/core/types'
import { TileM } from '../map/tiles/TileM'
import type { IMonsterTile } from '../map/tiles/types'

export class MonsterMovementSystem {
  private ctx: EngineContext

  constructor(ctx: EngineContext) {
    this.ctx = ctx
  }

  public update(grid: GridType): boolean {
    const entities = this.ctx.map.entities
    let changed = false

    const sortedMonsters = this.collectMonstersByPriority(entities)

    const playerPos = {
      x: this.ctx.player.pos.x,
      y: this.ctx.player.pos.y,
      lastX: this.ctx.player.lastX,
      lastY: this.ctx.player.lastY,
    }

    for (const monster of sortedMonsters) {
      if (entities[monster.y][monster.x] !== monster) continue

      if (this.processSingleMonsterTurn(monster, grid, entities, playerPos)) {
        changed = true
      }
    }

    return changed
  }

  private collectMonstersByPriority(entities: any[][]): IMonsterTile[] {
    const highPriority: IMonsterTile[] = []
    const lowPriority: IMonsterTile[] = []

    for (let y = 0; y < entities.length; y++) {
      for (let x = 0; x < entities[y].length; x++) {
        const entity = entities[y][x]
        if (!entity) continue

        if (entity instanceof TileM) {
          highPriority.push(entity as unknown as IMonsterTile)
        } else if (entity.char === 'm') {
          lowPriority.push(entity as IMonsterTile)
        }
      }
    }

    return [...highPriority, ...lowPriority]
  }

  private processSingleMonsterTurn(
    monster: IMonsterTile,
    grid: GridType,
    entities: any[][],
    player: { x: number; y: number; lastX: number; lastY: number }
  ): boolean {
    const cx = monster.x
    const cy = monster.y

    const { nx, ny } = monster.getNextPosition(grid, entities)

    if (cx === nx && cy === ny) {
      monster.stayQuiet()
      return false
    }

    const isSwapCollision = cx === player.x && cy === player.y && nx === player.lastX && ny === player.lastY
    if (isSwapCollision) {
      monster.stayQuiet()
      return false
    }

    if (entities[ny][nx] !== null) {
      monster.stayQuiet()
      return false
    }

    monster.updatePosition(nx, ny)
    entities[ny][nx] = monster
    entities[cy][cx] = null

    return true
  }
}
