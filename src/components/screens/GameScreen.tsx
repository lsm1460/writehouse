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
  onEnding: () => void
}

export function GameScreen({ backToTitle, onEnding }: GameScreenProps) {
  const { engine, gameState, currentRoomId, isLoading } = useGame()

  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const { cheatMode, handleActionReport, closeCheatMode } = useCheatMode()

  const openMenu = () => {
    setIsMenuOpened((prev) => !prev)

    engine.togglePause()
  }

  useGameInput({
    engine,
    disabled: isLoading || cheatMode || gameState === 'PAUSE' || gameState === 'GAME_OVER',
    onAction: handleActionReport,
    openMenu,
  })

  useEffect(() => {
    console.log('gameState',gameState)
    if (gameState === 'ENDING') {
      onEnding()
    }
  }, [gameState])

  const onResume = () => {
    setIsMenuOpened(false)

    engine.togglePause()
  }

  const onRestart = () => {
    setIsMenuOpened(false)

    engine.retryStage()
  }

  return (
    <>
      <GameScreenWrapper>
        <div
          className={`flex-1 w-full h-full relative flex items-center justify-center overflow-hidden font-sans transition-opacity ${
            isLoading ? 'pointer-events-none opacity-0 duration-0' : 'opacity-100 duration-500'
          }`}
        >
          <StageRenderer />
        </div>

        {!isLoading && <Tutorial />}

        {isLoading && <RoomTransition roomId={currentRoomId} />}

        {isMenuOpened && <GameMenu onResume={onResume} onRestart={onRestart} onExit={backToTitle} />}

        {gameState === 'GAME_OVER' && <GameOver onRestart={() => engine.retryStage()} />}

        <CheatInput
          isOpen={cheatMode}
          onClose={closeCheatMode}
          onExecuteCheat={(cmd) => engine.ctx.executeCheat(cmd)}
        />
      </GameScreenWrapper>

      {gameState === 'PLAYING' && !isLoading && <GameUi />}
    </>
  )
}
