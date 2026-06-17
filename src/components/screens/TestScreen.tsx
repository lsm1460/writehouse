import React, { useEffect, useRef, useState } from 'react'
import { useGame } from '~/context/GameContext'
import { useGameInput } from '~/hooks/input/useGameInput'
import { Camera } from '../renderers/Camera'
import { MapRenderer } from '../renderers/MapRenderer'

interface TestScreenProps {
  backToTitle: () => void
}

const VERTICAL_PAD = 50
const VIEW_WIDTH = 1024
const VIEW_HEIGHT = 576

export const TestScreen: React.FC<TestScreenProps> = ({ backToTitle }) => {
  const { engine, gameState, fog, map, player } = useGame()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [fps, setFps] = useState<number>(0)

  const cameraRef = useRef(new Camera(VIEW_WIDTH, VIEW_HEIGHT, VERTICAL_PAD))

  useGameInput({
    engine,
    disabled: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let localFrameCount = 0
    let fpsIntervalTime = performance.now()

    canvas.width = VIEW_WIDTH
    canvas.height = VIEW_HEIGHT

    const render = (now: number) => {
      localFrameCount++

      if (now - fpsIntervalTime >= 1000) {
        setFps(Math.round((localFrameCount * 1000) / (now - fpsIntervalTime)))
        localFrameCount = 0
        fpsIntervalTime = now
      }

      // 💡 카메라를 포함하여 렌더러 호출
      MapRenderer.render({
        ctx,
        map,
        player,
        fog,
        timestamp: now,
        camera: cameraRef.current, // 💡 카메라 주입
      })

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [map, player, fog, gameState])

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#0a0a0c]">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full aspect-[16/9] object-contain"
        style={{ imageRendering: 'pixelated' }}
      />

      <div className="absolute top-2 left-2 text-xs text-green-400 font-mono">FPS: {fps}</div>
    </div>
  )
}
