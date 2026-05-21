import type { LightState } from '~/core/types'

interface CellProps {
  lightState: LightState
}

export function Cell_i({ lightState }: CellProps) {
  const isGateOpened = lightState.environmentIntensity > 0

  const themeClass = isGateOpened 
    ? 'text-orange-400 font-black drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]' 
    : 'text-stone-500 font-medium opacity-60'

  return <span className={themeClass}>i</span>
}
