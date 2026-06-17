import React, { useEffect, useRef, useState } from 'react'
import { useGame } from '~/context/GameContext'
import { useGameInput } from '~/hooks/input/useGameInput'
import { CELL_SIZE } from '../game/consts'

interface TestScreenProps {
  backToTitle: () => void
}

const VERTICAL_PAD = 50
const VIEW_WIDTH = 1024
const VIEW_HEIGHT = 576

export const TestScreen: React.FC<TestScreenProps> = ({ backToTitle }) => {
  const { engine, gameState, fog, map, player, stageClear } = useGame()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [fps, setFps] = useState<number>(0)
  const [frameCount, setFrameCount] = useState<number>(0)

  // Canvas 게임 화면에서도 키보드/마우스 입력이 실제 동작하도록 useGameInput 연결
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

    // 캔버스 크기를 설정 (고정 비율 해상도)
    canvas.width = VIEW_WIDTH
    canvas.height = VIEW_HEIGHT

    const render = () => {
      const now = performance.now()
      localFrameCount++

      // FPS 계산 (1초마다)
      if (now - fpsIntervalTime >= 1000) {
        setFps(Math.round((localFrameCount * 1000) / (now - fpsIntervalTime)))
        localFrameCount = 0
        fpsIntervalTime = now
      }

      // 게임 데이터 가져오기
      const { grid, entities } = map
      const { pos: playerPos } = player

      const playerPixelX = playerPos.x * CELL_SIZE + CELL_SIZE / 2
      const playerPixelY = playerPos.y * CELL_SIZE + CELL_SIZE / 2

      const mapWidth = (grid[0]?.length || 0) * CELL_SIZE
      const mapHeight = grid.length * CELL_SIZE

      // StageGrid 카메라 오프셋 공식 적용
      const offsetX = VIEW_WIDTH / 2 - playerPixelX
      const offsetY = VIEW_HEIGHT / 2 - playerPixelY + VERTICAL_PAD

      // 캔버스 초기화 (배경색)
      ctx.fillStyle = '#0a0a0c'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      // 카메라 오프셋 적용
      ctx.translate(offsetX, offsetY)

      // 1. 그리드 타일 그리기
      for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        for (let x = 0; x < row.length; x++) {
          const tile = row[x]
          if (!tile) continue

          const lightState = fog.getLightState(x, y)
          const lightLevel = ['G', 'i'].includes(tile.char) ? 9 : fog.getLightLevel(x, y)

          // 화면 뷰포트 컬링 바운더리 체크 (최적화)
          const tilePixelX = x * CELL_SIZE
          const tilePixelY = y * CELL_SIZE
          const screenX = tilePixelX + offsetX
          const screenY = tilePixelY + offsetY

          if (
            screenX < -CELL_SIZE ||
            screenX > VIEW_WIDTH + CELL_SIZE ||
            screenY < -CELL_SIZE ||
            screenY > VIEW_HEIGHT + CELL_SIZE
          ) {
            continue
          }

          // 안개 및 시야에 따른 렌더링 스킵 (전혀 보이지 않는 타일)
          if (lightLevel === 0) {
            continue
          }

          // 기본 타일 배경색 결정
          let tileBgColor = '#1e1e24' // 바닥 기본색 (어두운 회색)
          if (tile.char === '#') {
            tileBgColor = '#3f3f46' // 벽 (중간 회색)
          } else if (tile.char === 'O') {
            tileBgColor = '#065f46' // 포탈/출구 (초록색 계열)
          } else if (tile.char === 'i') {
            tileBgColor = '#52525b' // 가로등 기본
          } else if (tile.char === 'G') {
            tileBgColor = '#14532d' // 발전기
          }

          ctx.fillStyle = tileBgColor
          ctx.fillRect(tilePixelX, tilePixelY, CELL_SIZE, CELL_SIZE)

          // 테두리
          ctx.strokeStyle = '#27272a'
          ctx.lineWidth = 1
          ctx.strokeRect(tilePixelX, tilePixelY, CELL_SIZE, CELL_SIZE)

          // 특수 전등 및 밝은 영역 표시
          if (tile.char === 'i' && lightState.environmentIntensity > 0) {
            ctx.fillStyle = 'rgba(234, 179, 8, 0.2)'
            ctx.fillRect(tilePixelX, tilePixelY, CELL_SIZE, CELL_SIZE)
          }

          // 타일 글자(Symbol) 렌더링
          if (tile.char.trim() && tile.char !== ' ') {
            ctx.fillStyle = '#a1a1aa'
            ctx.font = 'bold 12px monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(tile.char, tilePixelX + CELL_SIZE / 2, tilePixelY + CELL_SIZE / 2)
          }

          // 2. 엔티티(Entity) 그리기
          const entity = entities?.[y]?.[x] as any
          if (entity) {
            ctx.fillStyle = '#ef4444' // 기본 엔티티 색상 (빨간색)
            if (entity.type === 'ITEM' || entity.type === 'MIXED') {
              ctx.fillStyle = '#60a5fa' // 아이템 (하늘색)
            }
            ctx.font = 'bold 14px monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(
              entity.char || 'E',
              tilePixelX + CELL_SIZE / 2,
              tilePixelY + CELL_SIZE / 2 - 2
            )
          }

          // 3. 안개(Fog) 셰이딩 레이어 덮기 (lightLevel 1~9 사이를 불투명 검은색 오버레이로 구현)
          if (lightLevel < 9) {
            const shadowOpacity = 1 - lightLevel / 9
            ctx.fillStyle = `rgba(10, 10, 12, ${shadowOpacity})`
            ctx.fillRect(tilePixelX, tilePixelY, CELL_SIZE, CELL_SIZE)
          }
        }
      }

      // 4. 플레이어 그리기 (항상 맨 위에 렌더링)
      const playerX = playerPos.x * CELL_SIZE
      const playerY = playerPos.y * CELL_SIZE
      ctx.beginPath()
      ctx.arc(playerX + CELL_SIZE / 2, playerY + CELL_SIZE / 2, CELL_SIZE / 2.5, 0, Math.PI * 2)
      ctx.fillStyle = '#f97316' // 주황색 플레이어 원
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('@', playerX + CELL_SIZE / 2, playerY + CELL_SIZE / 2)

      ctx.restore()

      // 5. HUD 정보 오버레이 (캔버스 자체에 그리기)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(10, 10, 240, 90)
      ctx.strokeStyle = '#3f3f46'
      ctx.lineWidth = 1
      ctx.strokeRect(10, 10, 240, 90)

      ctx.fillStyle = '#4ade80'
      ctx.font = 'bold 14px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`FPS: ${fps}`, 20, 30)

      ctx.fillStyle = '#ffffff'
      ctx.font = '12px monospace'
      ctx.fillText(`Player Pos: (${playerPos.x}, ${playerPos.y})`, 20, 50)
      ctx.fillText(`Stage State: ${gameState}`, 20, 70)
      ctx.fillText(`Control: WASD / Arrow Keys`, 20, 90)

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [map, player, fog, gameState, fps])

  return (
    <div className="flex flex-col w-full h-screen bg-neutral-900 text-white p-4 font-mono select-none">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-700">
        <div>
          <h1 className="text-xl font-bold text-green-400">Canvas Gameplay Test</h1>
          <p className="text-xs text-neutral-400">
            실제 게임 상태를 Canvas에 그려 부드럽게 키보드로 플레이해보며 렉 성능을 비교 테스트합니다.
          </p>
        </div>
        <button
          onClick={backToTitle}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 rounded transition duration-200"
        >
          Back to Title
        </button>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center bg-neutral-950 rounded border border-neutral-800 overflow-hidden relative">
        <canvas
          ref={canvasRef}
          className="block border-2 border-neutral-800 shadow-2xl max-w-full max-h-full"
          style={{ width: VIEW_WIDTH, height: VIEW_HEIGHT }}
        />
      </div>
    </div>
  )
}
