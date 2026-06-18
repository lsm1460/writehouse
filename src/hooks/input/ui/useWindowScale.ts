import { useState, useEffect } from 'react'

interface ScaleInfo {
  scale: number
  width: number
  height: number
  isReady: boolean
}

export const VIRTUAL_WIDTH = 1024
export const VIRTUAL_HEIGHT = 576

export function useWindowScale(): ScaleInfo {
  const [scaleInfo, setScaleInfo] = useState<ScaleInfo>({
    scale: 1,
    width: VIRTUAL_WIDTH,
    height: VIRTUAL_HEIGHT,
    isReady: false,
  })

  useEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      const isMobilePortrait = windowHeight > windowWidth

      if (isMobilePortrait) {
        // 가로 기준을 1024로 유지하여 scale 점프를 원천 차단합니다.
        const deviceAspectRatio = windowHeight / windowWidth
        const mobileVirtualHeight = VIRTUAL_WIDTH * deviceAspectRatio
        const nextScale = windowWidth / VIRTUAL_WIDTH 

        setScaleInfo({
          scale: nextScale,
          width: VIRTUAL_WIDTH,
          height: mobileVirtualHeight,
          isReady: true,
        })
      } else {
        const scaleX = windowWidth / VIRTUAL_WIDTH
        const scaleY = windowHeight / VIRTUAL_HEIGHT
        const nextScale = Math.min(scaleX, scaleY)

        setScaleInfo({
          scale: nextScale,
          width: VIRTUAL_WIDTH,
          height: VIRTUAL_HEIGHT,
          isReady: true,
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return scaleInfo
}