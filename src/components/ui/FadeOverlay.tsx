import { useEffect, useState, type ReactNode } from 'react'

interface FadeOverlayProps {
  children: ReactNode
  in?: boolean
  delayMS?: number
  durationMS?: number
  onAnimationEnd?: () => void // 애니메이션 종료 콜백 추가
}

export function FadeOverlay({
  children,
  in: isOpen = true,
  delayMS = 300,
  durationMS = 500,
  onAnimationEnd,
}: FadeOverlayProps) {
  const [opacity, setOpacity] = useState(isOpen ? 0 : 1)

  useEffect(() => {
    let timerId: number
    let animationEndTimerId: number

    const fadeIn = () => {
      timerId = setTimeout(() => {
        setOpacity(1)
        animationEndTimerId = setTimeout(() => onAnimationEnd?.(), durationMS)
      }, delayMS)
    }

    const fadeOut = () => {
      timerId = setTimeout(() => {
        setOpacity(0)
        animationEndTimerId = setTimeout(() => onAnimationEnd?.(), durationMS)
      }, delayMS)
    }

    if (isOpen) {
      fadeIn()
    } else {
      fadeOut()
    }

    return () => {
      clearTimeout(timerId)
      clearTimeout(animationEndTimerId)
    }
  }, [isOpen, delayMS, durationMS, onAnimationEnd])

  return (
    <div
      className="fade absolute inset-0 flex items-center justify-center bg-black/40 z-40 backdrop-blur-xs"
      style={{
        opacity: opacity,
        transition: `opacity ${durationMS}ms ease-out`,
      }}
    >
      {children}
    </div>
  )
}
