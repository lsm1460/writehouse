import { useEffect, useState } from 'react'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'
import { MenuButton } from '../ui/MenuButton'

interface GameOverProps {
  onRestart: () => void
  delayMS?: number
}

export function GameOver({ onRestart, delayMS = 300 }: GameOverProps) {
  const { scale } = useWindowScale()
  const [isRendered, setIsRendered] = useState(false)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const renderTimer = setTimeout(() => {
      setIsRendered(true)
    }, delayMS)

    return () => clearTimeout(renderTimer)
  }, [delayMS])

  useEffect(() => {
    if (isRendered) {
      setOpacity(1)
    }
  }, [isRendered])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-[100] backdrop-blur-xs"
      style={{
        opacity: opacity,
        transition: 'opacity 500ms ease-out',
      }}
    >
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
        <div className="w-64">
          <MenuButton onClick={onRestart} className="shadow-[0_0_20px_rgba(255,255,255,0.15)]" isActive>
            RETRY STAGE
          </MenuButton>
        </div>

        <div className="absolute bottom-8 text-neutral-700 font-mono text-xs">[Space] or Click to Restart</div>
      </div>
    </div>
  )
}
