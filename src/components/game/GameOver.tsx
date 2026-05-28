import { useGame } from '~/context/GameContext'
import { FadeOverlay } from '../ui/FadeOverlay'
import { GameMenuLayout } from '../ui/GameMenuLayout'

interface GameOverProps {
  onRestart: () => void
  delayMS?: number
}

export function GameOver({ onRestart, delayMS = 300 }: GameOverProps) {
  const { engine } = useGame()
  const menuItems = [{ label: 'RETRY STAGE', action: onRestart }]

  return (
    <FadeOverlay delayMS={delayMS} durationMS={200} midDelayMS={999999}>
      <div className="flex flex-col items-center justify-center relative w-full h-full">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-400 uppercase tracking-tighter">Game Over</h2>
        </div>
        <GameMenuLayout engine={engine} menuItems={menuItems} />
      </div>
    </FadeOverlay>
  )
}