import React from 'react'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'

interface TitleScreenProps {
  onStart: () => void
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const { scale } = useWindowScale()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onStart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onStart])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-900 z-50">
      <div
        className="flex flex-col items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '1024px',
          height: '576px',
        }}
      >
        <div className="mb-12 text-center">
        <h1 className="text-8xl font-black text-white tracking-tighter mb-4 animate-pulse">
          WRITE HOUSE
        </h1>
        <p className="text-neutral-400 text-xl font-mono">
          An Archeological Puzzle Adventure
        </p>
      </div>

      <button
        onClick={onStart}
        className="px-12 py-4 bg-white text-black text-2xl font-bold hover:bg-neutral-200 transition-colors duration-200 rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      >
        START GAME
      </button>

      <div className="mt-16 grid grid-cols-2 gap-8 text-neutral-500 font-mono text-sm">
        <div className="flex flex-col items-center">
          <span className="text-neutral-300 mb-2 uppercase">Movement</span>
          <span>Arrow Keys</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-neutral-300 mb-2 uppercase">Interaction</span>
          <span>Space / Enter</span>
        </div>
      </div>

        <div className="absolute bottom-8 text-neutral-600 font-mono text-xs">
          © 2026 WriteHouse Studio. All rights reserved.
        </div>
      </div>
    </div>
  )
}
