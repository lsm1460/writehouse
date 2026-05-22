import { useEffect, type ReactNode } from 'react'
import { useGame } from '~/context/GameContext'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'
import { useGameInput } from '~/hooks/input/useGameInput'
import { QuickSlots } from '../game/QuickSlots'
import { StageGrid } from '../game/StageGrid'

interface GameScreenProps {
  children: ReactNode
}

export function GameScreen() {
  const { engine } = useGame()

  useEffect(() => {
    engine.start()
  }, [engine])

  useGameInput(engine)

  return (
    <>
      <ScreenWrapper>
        <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden font-sans">
          <StageGrid />
        </div>
      </ScreenWrapper>
      <GameUi />
    </>
  )
}

function ScreenWrapper({ children }: GameScreenProps) {
  const { scale, width, height } = useWindowScale()

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden select-none">
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="relative flex flex-col items-center justify-between shrink-0"
      >
        {/* CRT 모니터 스캔라인 효과 (가상 화면 내부에 완벽히 종속됨) */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] z-50 mix-blend-overlay opacity-40" />

        {/* 실제 화면에 그려질 알맹이들 */}
        <div className="w-full h-full flex flex-col items-center justify-between z-10 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

function GameUi() {
  const { scale } = useWindowScale()
  const { inventory } = useGame()
  
  return (
    <div
      className="fixed bottom-0 left-1/2 pb-5 w-full -translate-x-1/2 flex flex-col gap-4"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center bottom',
      }}
    >
      <QuickSlots inventorySystem={inventory} />
      <div className="w-full text-center text-xs text-neutral-500 font-mono">
        [Arrows]: Move | [Space]: Action
      </div>
    </div>
  )
}
