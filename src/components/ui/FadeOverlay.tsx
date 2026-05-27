import { useEffect, useState, type ReactNode } from 'react'

interface FadeOverlayProps {
  children: ReactNode
  mode?: 'fadeIn' | 'fadeOut' | 'fadeInOut'
  delayMS?: number
  durationMS?: number
  midDelayMS?: number
  onMidpoint?: () => void
  onAnimationEnd?: () => void
}

type TransitionPhase = 'IDLE' | 'FADING_OUT' | 'MIDPOINT' | 'FADING_IN' | 'COMPLETED'

export function FadeOverlay({
  children,
  mode = 'fadeIn',
  delayMS = 300,
  durationMS = 500,
  midDelayMS = 1000,
  onMidpoint,
  onAnimationEnd,
}: FadeOverlayProps) {
  const [phase, setPhase] = useState<TransitionPhase>('IDLE')
  const [opacity, setOpacity] = useState(mode === 'fadeOut' ? 1 : 0)

  useEffect(() => {
    let timerId: number

    if (mode === 'fadeIn') {
      timerId = setTimeout(() => {
        setOpacity(1)
        timerId = setTimeout(() => onAnimationEnd?.(), durationMS)
      }, delayMS)
      return () => clearTimeout(timerId)
    }

    if (mode === 'fadeOut') {
      timerId = setTimeout(() => {
        setOpacity(0)
        timerId = setTimeout(() => onAnimationEnd?.(), durationMS)
      }, delayMS)
      return () => clearTimeout(timerId)
    }

    if (mode === 'fadeInOut') {
      switch (phase) {
        case 'IDLE':
          timerId = setTimeout(() => {
            setPhase('FADING_OUT')
            setOpacity(1)
          }, delayMS)
          break

        case 'FADING_OUT':
          timerId = setTimeout(() => {
            setPhase('MIDPOINT')
            onMidpoint?.()
          }, durationMS)
          break

        case 'MIDPOINT':
          timerId = setTimeout(() => {
            setPhase('FADING_IN')
            setOpacity(0)
          }, midDelayMS)
          break

        case 'FADING_IN':
          timerId = setTimeout(() => {
            setPhase('COMPLETED')
            onAnimationEnd?.()
          }, durationMS)
          break

        case 'COMPLETED':
          break
      }
    }

    return () => clearTimeout(timerId)
  }, [mode, phase, delayMS, durationMS, midDelayMS, onMidpoint, onAnimationEnd])

  const shouldRenderContent = () => {
    if (mode === 'fadeIn') return opacity > 0
    if (mode === 'fadeOut') return true
    return phase !== 'IDLE' && phase !== 'COMPLETED'
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black z-40"
      style={{
        opacity: opacity,
        transition: `opacity ${durationMS}ms ease-out`,
      }}
    >
      {shouldRenderContent() && (
        <div
          className="transition-opacity ease-out"
          style={{
            transitionDuration: `${durationMS}ms`,
            opacity: phase === 'FADING_IN' ? 0 : 1,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
