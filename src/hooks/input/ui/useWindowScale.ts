import { useState, useEffect } from 'react'

interface ScaleInfo {
  scale: number
  width: number
  height: number
}

// 게임의 가상 내부 기준 해상도 (도스 감성의 16:9 비율 예시)
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

      // 가로 비율과 세로 비율 중 더 좁은 쪽에 맞춰 화면을 스케일링합니다 (Letterbox 방식)
      const scaleX = windowWidth / VIRTUAL_WIDTH
      const scaleY = windowHeight / VIRTUAL_HEIGHT
      const nextScale = Math.min(scaleX, scaleY)

      setScaleInfo({
        // 너무 작아지거나 깨지는 것을 방지하기 위해 최소/최대 제한을 걸어둘 수도 있습니다.
        scale: nextScale,
        width: VIRTUAL_WIDTH,
        height: VIRTUAL_HEIGHT,
      })
    }

    // 초기 실행 및 이벤트 등록
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return scaleInfo
}
