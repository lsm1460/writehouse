import { useWindowScale } from '~/hooks/input/ui/useWindowScale'
import { MenuButton } from '../ui/MenuButton'

interface GameOverProps {
  onRestart: () => void
}

export function GameOver({ onRestart }: GameOverProps) {
  const { scale } = useWindowScale()

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[100] backdrop-blur-xs">
      <div
        className="flex flex-col items-center justify-center relative"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '1024px',
          height: '576px',
        }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-5xl font-black text-neutral-400 tracking-tighter uppercase">Game Over</h2>
        </div>

        <MenuButton
          onClick={onRestart}
          className="shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          textClassName="text-xl"
        >
          RETRY STAGE
        </MenuButton>

        <div className="absolute bottom-8 text-neutral-700 font-mono text-xs">[Space] or Click to Restart</div>
      </div>
    </div>
  )
}
