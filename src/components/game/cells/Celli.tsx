import type { LightState } from '~/core/types'

interface CellProps {
  lightState: LightState
}

export function Celli({ lightState }: CellProps) {
  const isGateOpened = lightState.environmentIntensity > 0

  const themeClass = isGateOpened ? 'text-emerald-400 font-black' : ''

  return <span className={themeClass}>i</span>
}
