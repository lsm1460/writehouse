import { useEffect, type ReactNode } from 'react'
import { useGame } from '~/context/GameContext'
import { useWindowScale, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from '~/hooks/input/ui/useWindowScale'
import { useGameInput } from '~/hooks/input/useGameInput'
import { QuickSlots } from '../game/QuickSlots'
import { StageGrid } from '../game/StageGrid'

interface GameScreenProps {
  children: ReactNode
}

export function GameScreen() {
  const { engine, ctx } = useGame()

  useEffect(() => {
    ctx.fog.update()
    ctx.onChange()
  }, [engine])

  useGameInput(engine)

  return (
    <ScreenWrapper>
      <StageGrid />

      <QuickSlots inventorySystem={engine.ctx.inventory} />

      <div className="w-full mt-4 text-center text-2xl text-neutral-500 font-mono">
        [Arrows]: Move | [Space]: Action | [1-4]: Quick Slot
      </div>
    </ScreenWrapper>
  )
}

function ScreenWrapper({ children }: GameScreenProps) {
  const { scale } = useWindowScale()

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden select-none">
      <div
        style={{
          width: `${VIRTUAL_WIDTH}px`,
          height: `${VIRTUAL_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center', // 중앙을 기준으로 깔끔하게 줌인/아웃
        }}
        className="relative p-8 flex flex-col items-center justify-between shrink-0"
      >
        {/* CRT 모니터 스캔라인 효과 (가상 화면 내부에 완벽히 종속됨) */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] z-50 mix-blend-overlay opacity-40" />

        {/* 실제 화면에 그려질 알맹이들 */}
        <div className="w-full h-full flex flex-col items-center justify-between z-10">{children}</div>
      </div>
    </div>
  )
}
