import { type ReactNode } from 'react'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'

interface ScreenWrapperProps {
  children: ReactNode
}

export function GameScreenWrapper({ children }: ScreenWrapperProps) {
  const { scale, width, height } = useWindowScale()

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden select-none">
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="relative flex flex-col items-center justify-between shrink-0"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] z-50 mix-blend-overlay opacity-40" />

        <div className="w-full h-full flex flex-col items-center justify-between z-10 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
