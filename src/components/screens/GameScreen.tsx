import { useEffect, useState } from 'react'
import { useGame } from '~/context/GameContext'
import { useGameInput } from '~/hooks/input/useGameInput'
import { useCheatMode } from '~/hooks/useCheatMode'
import { GameMenu } from '../game/GameMenu'
import { GameOver } from '../game/GameOver'
import { GameScreenWrapper } from '../game/GameScreenWrapper'
import { GameUi } from '../game/GameUi'
import { RoomTransition } from '../game/RoomTransition'
import { Tutorial } from '../game/Tutorial'
import { StageRenderer } from '../renderers/StageRenderer'
import { CheatInput } from '../ui/CheatInput'

type GameScreenProps = {
  backToTitle: () => void
}

export function GameScreen({ backToTitle }: GameScreenProps) {
  const { engine, gameState, currentRoomId } = useGame()
  const [isTransitioning, setIsTransitioning] = useState(true)

  const { cheatMode, handleActionReport, closeCheatMode } = useCheatMode()

  useGameInput({
    engine,
    disabled: isTransitioning || cheatMode || gameState === 'MENU' || gameState === 'GAME_OVER',
    onAction: handleActionReport,
  })

  useEffect(() => {
    setIsTransitioning(true)
  }, [currentRoomId])

  return (
    <>
      <GameScreenWrapper>
        <div
          className={`flex-1 w-full h-full relative flex items-center justify-center overflow-hidden font-sans transition-opacity ${
            isTransitioning ? 'pointer-events-none opacity-0 duration-0' : 'opacity-100 duration-500'
          }`}
        >
          <StageRenderer />
        </div>

        {!isTransitioning && <Tutorial />}

        {isTransitioning && (
          <RoomTransition roomId={currentRoomId} onTransitionEnd={() => setIsTransitioning(false)} />
        )}

        {gameState === 'MENU' && (
          <GameMenu onResume={() => engine.toggleMenu()} onRestart={() => engine.retryStage()} onExit={backToTitle} />
        )}
        
        {gameState === 'GAME_OVER' && <GameOver onRestart={() => engine.retryStage()} />}

        <CheatInput
          isOpen={cheatMode}
          onClose={closeCheatMode}
          onExecuteCheat={(cmd) => engine.ctx.executeCheat(cmd)}
        />
      </GameScreenWrapper>
      
      {gameState === 'PLAYING' && !isTransitioning && <GameUi />}
    </>
  )
}