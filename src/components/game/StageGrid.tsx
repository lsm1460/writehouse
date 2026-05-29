import { useGame } from '~/context/GameContext'
import { GridCell } from './GridCell'
import { CELL_SIZE } from './consts'

const VERTICAL_PAD = 50

export function StageGrid() {
  const {
    fog,
    map: { grid },
    player: { pos: playerPos, targetPos },
    stageClear,
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
            {row.map((tile, x) => {
              const isPlayer = playerPos.x === x && playerPos.y === y
              const isTarget = targetPos.x === x && targetPos.y === y

              const renderable = {
                tile,
                lightLevel: ['G', 'i'].includes(tile.char) ? 9 : fog.getLightLevel(x, y),
                lightState: fog.getLightState(x, y),
                isPlayer,
                isTarget,
              }

              return <GridCell key={x} cell={renderable} stageClear={stageClear} />
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
