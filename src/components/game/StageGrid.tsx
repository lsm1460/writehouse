import { useGame } from '~/context/GameContext'
import { GridCell } from './GridCell'

export function StageGrid() {
  const { map, player } = useGame()
  
    const { grid } = map
    const { pos: playerPos, targetPos } = player

  return (
    <div className="flex flex-col p-4">
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((tile, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y
            const isTarget = targetPos.x === x && targetPos.y === y

            return <GridCell key={x} tile={tile} isPlayer={isPlayer} isTarget={isTarget} />
          })}
        </div>
      ))}
    </div>
  )
}
