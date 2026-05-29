import { memo } from 'react'

interface ElectricOverlayProps {
  isWet: boolean
}

export const ElectricOverlay = memo(function ElectricOverlay({ isWet }: ElectricOverlayProps) {
  const electricStyles = {
    bgColor: isWet ? 'bg-amber-400/40 border-amber-300/60' : 'bg-yellow-500/20 border-yellow-400/40',
    glow: isWet ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]',
    textColor: isWet ? 'text-amber-300' : 'text-yellow-400',
  }

  return (
    <>
      <span
        className={`absolute inset-0 border-2 rounded-sm opacity-80 animate-flash -z-10 ${electricStyles.bgColor} ${electricStyles.glow}`}
      />
      <span
        className={`absolute top-0.5 left-0 w-3.5 h-3.5 flex items-center justify-center z-20 animate-bounce ${electricStyles.textColor}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M13 2v9h5l-7 11v-9H6z" />
        </svg>
      </span>
    </>
  )
})
