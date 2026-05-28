import { useEffect, useState } from 'react'
import { useGame } from '~/context/GameContext'
import { useGameInput } from '~/hooks/input/useGameInput'
import { GameOver } from '../game/GameOver'
import { GameUi } from '../game/GameUi'
import { GameScreenWrapper } from '../game/GameScreenWrapper'
import { StageGrid } from '../game/StageGrid'
import { RoomTransition } from '../game/RoomTransition'
import { GameMenu } from '../game/GameMenu'

type GameScreenProps = {
  backToTitle: () => void
}

export function GameScreen({ backToTitle }: GameScreenProps) {
  const { engine, gameState, currentRoomId, map } = useGame()
  const [isTransitioning, setIsTransitioning] = useState(true)

  useGameInput({ engine, disabled: isTransitioning })

  useEffect(() => {
    setIsTransitioning(true)
  }, [currentRoomId])

  return (
    <>
      <GameScreenWrapper>
        <div
          className={`flex-1 w-full relative flex items-center justify-center overflow-hidden font-sans transition-opacity ${
            isTransitioning ? 'pointer-events-none opacity-0 duration-0' : 'opacity-100 duration-500'
          }`}
        >
          <StageGrid />
        </div>

        {isTransitioning && (
          <RoomTransition
            floorNumber={map.floorNumber}
            roomId={currentRoomId}
            onTransitionEnd={() => setIsTransitioning(false)}
          />
        )}

        {gameState === 'MENU' && (
          <GameMenu onResume={() => engine.toggleMenu()} onRestart={() => engine.retryStage()} onExit={backToTitle} />
        )}
        {gameState === 'GAME_OVER' && <GameOver onRestart={() => engine.retryStage()} />}
      </GameScreenWrapper>
      {gameState === 'PLAYING' && !isTransitioning && <GameUi />}
    </>
  )
}
