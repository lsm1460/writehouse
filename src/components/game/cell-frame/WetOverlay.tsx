import { memo } from 'react'

export const WetOverlay = memo(function WetOverlay() {
  return (
    <>
      <span className="absolute bottom-0.5 left-0 right-0 mx-auto h-[40%] w-[90%] bg-cyan-500/30 border border-cyan-400/50 rounded-full drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] -z-10" />
      <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 flex items-center justify-center text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.8)] z-20 animate-pulse">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </span>
    </>
  )
})
