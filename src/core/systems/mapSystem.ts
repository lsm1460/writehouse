import { EngineContext } from '../engineContext'
import type { MapData } from '../gameEngine'
import { Tile } from '../map/Tile'
import { createTile } from '../map/tiles'

export class MapSystem {
  public grid: Tile[][] = []
  public roomTitle: string
  
  private ctx: EngineContext
  private mapData: MapData
  private currentRoomId: string

  constructor(ctx: EngineContext, mapData: MapData, roomId: string) {
    this.ctx = ctx
    this.mapData = mapData
    this.currentRoomId = roomId
    this.roomTitle = 'Unknown'

    this.loadRoom(roomId)
  }

  public loadRoom(roomId: string): { x: number; y: number } | undefined {
    const room = this.mapData.floors[0].rooms.find((r) => r.room_id === roomId)
    
    this.currentRoomId = roomId
    this.roomTitle = room ? room.title : 'Unknown'
    
    const rawGrid: string[][] = room ? JSON.parse(JSON.stringify(room.grid)) : [[]]

    let spawnPos: { x: number; y: number } | undefined = undefined

    this.grid = rawGrid.map((row, i) => 
      row.map((cell, j) => {
        const tile = createTile(cell, j, i)
        
        if (cell === 'S') {
          spawnPos = { x: j, y: i }
        }
        
        return tile
      })
    )

    return spawnPos
  }

  public loadNextRoom() {
    const rooms = this.mapData.floors[0].rooms
    const currentIndex = rooms.findIndex((r) => r.room_id === this.currentRoomId)

    if (currentIndex !== -1 && currentIndex + 1 < rooms.length) {
      const nextRoomId = rooms[currentIndex + 1].room_id
      return this.loadRoom(nextRoomId)
    } else {
      console.log('🎉 마지막 방입니다! 던전의 끝에 도달했습니다.')
    }
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
    return this.grid[y][x]
  }
}