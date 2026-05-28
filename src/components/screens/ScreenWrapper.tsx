import type { ReactNode } from 'react'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'

interface ScreenWrapperProps {
  children: ReactNode
  className?: string
}

export function ScreenWrapper({ children, className = 'py-5' }: ScreenWrapperProps) {
  const { isReady, scale } = useWindowScale()

  if (!isReady) return <></>

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div
        className={`flex flex-col items-center justify-center ${className}`}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '1024px',
          height: '576px',
        }}
      >
        {children}
      </div>
    </div>
  )
}
