import { useGame } from '~/context/GameContext'
import { Spinner } from './Spinner'

export function SaveIndicator() {
  const { isSaving } = useGame()

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none ${
        isSaving ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`}
    >
      <Spinner className="h-6 w-6 text-amber-500" />
    </div>
  )
}