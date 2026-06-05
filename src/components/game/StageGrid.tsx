import { useGame } from '~/context/GameContext'
import { CELL_SIZE } from './consts'
import { GridTile } from './GridTile'

const VERTICAL_PAD = 50

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

  return (
    <div className="absolute flex flex-col p-4 bg-black select-none">
      <div
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px)`,
        }}
        className="flex flex-col transition-transform duration-200 ease-out"
      >
        {grid.map((row, y) => (
          <div key={y} className="flex">
            {row.map((tile: any, x: number) => (
              <GridTile
                key={x}
                x={x}
                y={y}
                tile={tile}
                fog={fog}
                entities={entities}
                deathEvents={deathEvents}
                playerPos={playerPos}
                targetPos={targetPos}
                stageClear={stageClear}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
