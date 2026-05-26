import { useEffect } from 'react'
import { useGame } from '~/context/GameContext'
import { useGameInput } from '~/hooks/input/useGameInput'
import { GameOver } from '../game/GameOver'
import { GameUi } from '../game/GameUi'
import { ScreenWrapper } from '../game/ScreenWrapper'
import { StageGrid } from '../game/StageGrid'

export function GameScreen() {
  const { engine, gameState } = useGame()

  useEffect(() => {
    engine.start()
  }, [engine])

  useGameInput({ engine })

  return (
    <>
      <ScreenWrapper>
        <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden font-sans">
          <StageGrid />
        </div>
      </ScreenWrapper>
      <GameUi />

      {gameState === 'GAME_OVER' && <GameOver onRestart={() => engine.retryStage()} />}
    </>
  )
}
