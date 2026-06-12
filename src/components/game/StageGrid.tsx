import { useMemo } from 'react'
import { useGame } from '~/context/GameContext'
import { CELL_SIZE } from './consts'
import { GridTile } from './GridTile'

const VERTICAL_PAD = 50
const VIEW_WIDTH = 1024
const VIEW_HEIGHT = 576
const BUFFER_CELLS = 4

export function StageGrid() {
  const {
    fog,
    map: { grid, entities },
    player: { pos: playerPos, targetPos },
    stageClear,
    deathEvents,
  } = useGame()

  const playerPixelX = playerPos.x * CELL_SIZE + CELL_SIZE / 2
  const playerPixelY = playerPos.y * CELL_SIZE + CELL_SIZE / 2

  const mapWidth = grid[0]?.length * CELL_SIZE
  const mapHeight = grid.length * CELL_SIZE

  const offsetX = mapWidth / 2 - playerPixelX
  const offsetY = mapHeight / 2 - playerPixelY + VERTICAL_PAD

  const deathEventsMap = useMemo(() => {
    const map = new Map()
    if (!deathEvents) return map
    for (const event of deathEvents) {
      if (event) {
        map.set(`${event.x},${event.y}`, event)
      }
    }
    return map
  }, [deathEvents])

  const visibleCols = Math.ceil(VIEW_WIDTH / CELL_SIZE) + BUFFER_CELLS * 2
  const visibleRows = Math.ceil(VIEW_HEIGHT / CELL_SIZE) + BUFFER_CELLS * 2

  const startX = Math.max(0, playerPos.x - Math.floor(visibleCols / 2))
  const endX = Math.min((grid[0]?.length || 0) - 1, playerPos.x + Math.floor(visibleCols / 2))
  const startY = Math.max(0, playerPos.y - Math.floor(visibleRows / 2))
  const endY = Math.min(grid.length - 1, playerPos.y + Math.floor(visibleRows / 2))

  const paddingTop = startY * CELL_SIZE
  const paddingLeft = startX * CELL_SIZE

  const slicedGrid = useMemo(() => {
    return grid.slice(startY, endY + 1)
  }, [grid, startY, endY])

  return (
    <div className="absolute flex flex-col p-4 bg-black select-none">
      <div
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          paddingTop: `${paddingTop}px`,
          paddingLeft: `${paddingLeft}px`,
        }}
        className="flex flex-col transition-transform duration-200 ease-out"
      >
        {slicedGrid.map((row, relativeY) => {
          const y = startY + relativeY
          const slicedRow = row.slice(startX, endX + 1)

          return (
            <div key={y} className="flex">
              {slicedRow.map((tile: any, relativeX: number) => {
                const x = startX + relativeX
                const lightState = fog.getLightState(x, y)
                const lightLevel = fog.getLightLevel(x, y)

                return (
                  <GridTile
                    key={x}
                    x={x}
                    y={y}
                    tile={tile}
                    lightState={lightState}
                    lightLevel={lightLevel}
                    entities={entities}
                    deathEvents={deathEventsMap}
                    playerPos={playerPos}
                    targetPos={targetPos}
                    stageClear={stageClear}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
