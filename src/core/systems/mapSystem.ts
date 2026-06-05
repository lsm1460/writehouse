import { EngineContext } from '../engineContext'
import type { MapData } from '../gameEngine'
import { createTile } from '../map/tiles'
import { FloorTile } from '../map/tiles/FloorTile'
import type { GridType } from '../types'

export class MapSystem {
  public grid: GridType = []
  public entities: any[][] = []
  public floorNumber: number = 0
  public currentRoomId: string = ''

  private ctx: EngineContext
  private mapData: MapData

  constructor(ctx: EngineContext, mapData: MapData) {
    this.ctx = ctx
    this.mapData = mapData
  }

  public loadRoom(roomId: string): { x: number; y: number } | undefined {
    const roomData = this.findRoomAndFloor(roomId)
    if (!roomData) return undefined

    this.currentRoomId = roomId
    this.floorNumber = roomData.floor ? roomData.floor.floor_number : 0

    const rawGrid: string[][] = roomData.room ? JSON.parse(JSON.stringify(roomData.room.grid)) : [[]]

    return this.buildGrid(rawGrid)
  }

  private findRoomAndFloor(roomId: string) {
    for (const floor of this.mapData.floors) {
      const room = floor.rooms.find((r) => r.room_id === roomId)
      if (room) {
        return { floor, room }
      }
    }
    return undefined
  }

  private buildGrid(rawGrid: string[][]): { x: number; y: number } | undefined {
    let spawnPos: { x: number; y: number } | undefined = undefined

    this.entities = Array.from({ length: rawGrid.length }, () => Array(rawGrid[0]?.length || 0).fill(null))

    this.grid = rawGrid.map((row, i) =>
      row.map((cell, j) => {
        if (['M', 'm'].includes(cell)) {
          const floorTile = new FloorTile(' ', j, i)

          const entityTile = createTile(cell, j, i)
          this.entities[i][j] = entityTile

          return floorTile
        }

        const tile = createTile(cell, j, i)

        if (cell === 'S') {
          spawnPos = { x: j, y: i }
        }

        return tile
      })
    )

    return spawnPos
  }

  public reloadCurrentRoom() {
    return this.loadRoom(this.currentRoomId)
  }

  public getNextRoomId(): string | undefined {
    for (let f = 0; f < this.mapData.floors.length; f++) {
      const currentFloor = this.mapData.floors[f]
      const currentIndex = currentFloor.rooms.findIndex((r) => r.room_id === this.currentRoomId)

      if (currentIndex !== -1) {
        if (currentIndex + 1 < currentFloor.rooms.length) {
          return currentFloor.rooms[currentIndex + 1].room_id
        }

        if (f + 1 < this.mapData.floors.length) {
          return this.mapData.floors[f + 1].rooms[0].room_id
        }

        console.log('🎉 마지막 방입니다! 던전의 끝에 도달했습니다.')
        return undefined
      }
    }

    return undefined
  }

  public isWalkable(x: number, y: number): boolean {
    if (!this.isValid(x, y)) return false
    return this.grid[y][x].isWalkable
  }

  public isValid(x: number, y: number): boolean {
    return y >= 0 && y < this.grid.length && x >= 0 && x < this.grid[0].length
  }

  public getTargetTile() {
    const { x, y } = this.ctx.player.targetPos
    if (!this.isValid(x, y)) return

    return this.entities[y][x] || this.grid[y][x]
  }
}
