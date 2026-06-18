import { useEffect, useRef, useState } from 'react'
import { useGame } from '~/context/GameContext'
import { Camera } from '../renderers/Camera'
import { GameRenderer } from '../renderers/GameRenderer'
import { EffectRenderer } from '../renderers/EffectRenderer'

const VERTICAL_PAD = 50
const VIEW_WIDTH = 1024
const VIEW_HEIGHT = 576

export function StageRenderer() {
  const { map, player, fog, stageClear, deathEvents, turn } = useGame()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [fps, setFps] = useState<number>(0)

  const cameraRef = useRef(new Camera(VIEW_WIDTH, VIEW_HEIGHT, VERTICAL_PAD))

  const gameDataRef = useRef({ map, player, fog, stageClear, deathEvents })

  useEffect(() => {
    gameDataRef.current = { map, player, fog, stageClear, deathEvents }
  }, [map, player, fog, stageClear, deathEvents])

  useEffect(() => {
    EffectRenderer.reset()
  }, [turn])

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

      const { map, player, fog, stageClear, deathEvents } = gameDataRef.current

      GameRenderer.render({
        ctx,
        map,
        player,
        fog,
        deathEvents,
        stageClear,
        timestamp: now,
        camera: cameraRef.current,
      })

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full aspect-[16/9] object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute top-4 left-4 text-xs text-green-400 font-mono pointer-events-none opacity-70">
        FPS: {fps}
      </div>
    </div>
  )
}
