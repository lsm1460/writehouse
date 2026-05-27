import { useEffect, useState } from 'react'
import { useGame } from '~/context/GameContext'
import { useGameInput } from '~/hooks/input/useGameInput'
import { GameOver } from '../game/GameOver'
import { GameUi } from '../game/GameUi'
import { ScreenWrapper } from '../game/ScreenWrapper'
import { StageGrid } from '../game/StageGrid'
import { RoomTransition } from '../game/RoomTransition'
import { GameMenu } from '../game/GameMenu'

type GameScreenProps = {
  backToTitle: () => void
}

export function GameScreen({ backToTitle }: GameScreenProps) {
  const { engine, gameState, currentRoomId, map } = useGame()
  
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
  }, [currentRoomId])

  useGameInput({ engine, disabled: isTransitioning })

  return (
    <>
      <ScreenWrapper>
        {/* 입력 제한을 훅 내부에서 처리 못 할 경우, 전환 중일 때 전체를 투명 패널로 덮어 마우스/키 입력을 차단할 수도 있습니다 */}
        <div className={`flex-1 w-full relative flex items-center justify-center overflow-hidden font-sans ${isTransitioning ? 'pointer-events-none' : ''}`}>
          <StageGrid />
        </div>

        {/* 오직 전환 중일 때만 렌더링(마운트)하며, 끝나면 자동으로 언마운트 처리 */}
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
      </ScreenWrapper>
      <GameUi />
    </>
  )
}