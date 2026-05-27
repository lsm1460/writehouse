import { useState, useEffect } from 'react'

interface ScaleInfo {
  scale: number
  width: number
  height: number
  isReady: boolean // 비율 확정 여부를 나타내는 상태 추가
}

export const VIRTUAL_WIDTH = 1024
export const VIRTUAL_HEIGHT = 576

export function useWindowScale(): ScaleInfo {
  const [scaleInfo, setScaleInfo] = useState<ScaleInfo>({
    scale: 1,
    width: VIRTUAL_WIDTH,
    height: VIRTUAL_HEIGHT,
    isReady: false, // 초기값은 아직 확정되지 않은 상태(false)로 시작
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
          isReady: true, // 첫 계산 완료 시 true
        })
      } else {
        const scaleX = windowWidth / VIRTUAL_WIDTH
        const scaleY = windowHeight / VIRTUAL_HEIGHT
        const nextScale = Math.min(scaleX, scaleY)

        setScaleInfo({
          scale: nextScale,
          width: VIRTUAL_WIDTH,
          height: VIRTUAL_HEIGHT,
          isReady: true, // 첫 계산 완료 시 true
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return scaleInfo
}
