import React, { useEffect, useState } from 'react'

const FRAME_INTERVAL_MS = 1500
const TOTAL_FRAMES = 8

export const TitleBackground: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState(1)

  useEffect(() => {
    for (let i = 1; i < TOTAL_FRAMES + 1; i++) {
      const img = new Image()
      img.src = `./title/before/b${i}.png`
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrame((prev) => ((prev + 1) % TOTAL_FRAMES) + 1)
    }, FRAME_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      <img src={`./title/before/b${currentFrame}.png`} alt="Title Background Animation" className="absolute inset-0 w-full h-full object-cover" />
      {/* Hidden images to ensure browser keeps them in memory / loaded */}
      <div className="hidden">
        {Array.from({ length: TOTAL_FRAMES }).map((_, i) => (
          <img key={i} src={`./title/before/bt_${i}.png`} alt="" />
        ))}
      </div>
    </div>
  )
}
