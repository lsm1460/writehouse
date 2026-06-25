import { useEffect, useRef } from 'react'
import { useGame } from '~/context/GameContext'
import { Camera } from '../renderers/Camera'
import { EffectRenderer } from '../renderers/EffectRenderer'
import { GameRenderer } from '../renderers/GameRenderer'

const VERTICAL_PAD = 50
const VIEW_WIDTH = 1024
const VIEW_HEIGHT = 576

export function StageRenderer() {
  const { engine, stageClear, deathEvents, turn } = useGame()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const cameraRef = useRef(new Camera(VIEW_WIDTH, VIEW_HEIGHT, VERTICAL_PAD))

  const gameDataRef = useRef({ engine, stageClear, deathEvents })

  useEffect(() => {
    gameDataRef.current = { engine, stageClear, deathEvents }
  }, [engine, stageClear, deathEvents])

  useEffect(() => {
    EffectRenderer.reset()
  }, [turn])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    canvas.width = VIEW_WIDTH
    canvas.height = VIEW_HEIGHT

    const render = (now: number) => {

      const { engine, stageClear, deathEvents } = gameDataRef.current

      GameRenderer.render({
        ctx,
        engine,
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
    </div>
  )
}
