import { MenuButton } from '../ui/MenuButton'
import { FadeOverlay } from '../ui/FadeOverlay'

interface GameOverProps {
  onRestart: () => void
  delayMS?: number
}

export function GameOver({ onRestart, delayMS = 300 }: GameOverProps) {
  return (
    <FadeOverlay delayMS={delayMS} durationMS={200} midDelayMS={999999}>
      <div className="flex flex-col items-center justify-center relative w-full h-full">
        <div className="mb-8 text-center">
          <h2 className="text-5xl font-black text-neutral-400 tracking-tighter uppercase">Game Over</h2>
        </div>

        <div className="w-64 flex flex-col gap-4 items-center">
          <MenuButton onClick={onRestart} className="shadow-[0_0_20px_rgba(255,255,255,0.15)]" isActive>
            RETRY STAGE
          </MenuButton>
        <p className="text-neutral-400 font-mono text-xs">[Space] or Click to Restart</p>
        </div>

      </div>
    </FadeOverlay>
  )
}
