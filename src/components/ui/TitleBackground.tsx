import React, { useEffect, useState } from 'react'
import { useGame } from '~/context/GameContext'

const FRAME_INTERVAL_MS = 1500
const TOTAL_FRAMES = 8

export const TitleBackground: React.FC = () => {
  const { isGameClear } = useGame()
  const [currentFrame, setCurrentFrame] = useState(1)

  const basePath = isGameClear ? '/title/after' : '/title/before'

  useEffect(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `${basePath}/${i}.png`
    }
  }, [basePath])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev % TOTAL_FRAMES) + 1)
    }, FRAME_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      <img src={`${basePath}/${currentFrame}.png`} alt="Title Background Animation" className="absolute inset-0 w-full h-full object-cover" />

      <div className="hidden">
        {Array.from({ length: TOTAL_FRAMES }).map((_, i) => (
          <img key={i + 1} src={`${basePath}/${i + 1}.png`} alt="" />
        ))}
      </div>
    </div>
  )
}
