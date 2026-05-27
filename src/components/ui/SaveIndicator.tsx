import { useGame } from '~/context/GameContext'

export function SaveIndicator() {
  const { isSaving } = useGame()

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none ${
        isSaving ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`}
    >
      <svg
        className="animate-spin h-6 w-6 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}
