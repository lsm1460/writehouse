import { useState, useEffect } from 'react'

interface ScaleInfo {
  scale: number
  width: number
  height: number
}

export const VIRTUAL_WIDTH = 1024
export const VIRTUAL_HEIGHT = 576

export function useWindowScale(): ScaleInfo {
  const [scaleInfo, setScaleInfo] = useState<ScaleInfo>({
    scale: 1,
    width: VIRTUAL_WIDTH,
    height: VIRTUAL_HEIGHT,
  })

  useEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      const isMobilePortrait = windowHeight > windowWidth

      if (isMobilePortrait) {
        const mobileVirtualWidth = 480
        
        const deviceAspectRatio = windowHeight / windowWidth
        const mobileVirtualHeight = mobileVirtualWidth * deviceAspectRatio

        const nextScale = windowWidth / mobileVirtualWidth

        setScaleInfo({
          scale: nextScale,
          width: mobileVirtualWidth,
          height: mobileVirtualHeight,
        })
      } else {
        const scaleX = windowWidth / VIRTUAL_WIDTH
        const scaleY = windowHeight / VIRTUAL_HEIGHT
        const nextScale = Math.min(scaleX, scaleY)

        setScaleInfo({
          scale: nextScale,
          width: VIRTUAL_WIDTH,
          height: VIRTUAL_HEIGHT,
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return scaleInfo
}