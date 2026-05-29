import type { LightState } from '~/core/types'

interface CellProps {
  lightState: LightState
}

export function Cell_i({ lightState }: CellProps) {
  const isActive = lightState.environmentIntensity > 0

  const themeClass = isActive
    ? 'text-orange-400 font-black drop-shadow-[0_0_4px_rgba(251,146,60,0.6)] scale-105 transition-transform duration-300'
    : 'text-neutral-500 font-medium transition-colors duration-300'

  return (
    <span className={`relative flex items-center justify-center w-full h-full ${themeClass}`}>
      {isActive && (
        <span className="absolute top-[22%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-300 shadow-[0_0_10px_#fdba74,0_0_4px_#f97316] z-20 animate-pulse pointer-events-none" />
      )}

      {isActive && (
        <span className="absolute top-[22%] left-1/2 w-2 h-2 rounded-full border-2 border-orange-400 bg-orange-500/5 z-10 animate-shockwave pointer-events-none" />
      )}

      <span className="relative z-0 select-none">i</span>
    </span>
  )
}
