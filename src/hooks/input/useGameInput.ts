import { useEffect, useRef } from 'react'
import { GameEngine } from '~/core/gameEngine'
import { mapGamepadToResponse } from './gamepadAction'
import { mapKeyboardToResponse } from './keyboardAction'
import type { GameAction } from './types'

export function useGameInput(engine: GameEngine) {
  const lastGamepadTime = useRef<number>(0)
  const gamepadCooldownMS = 200

  useEffect(() => {
    // 공통 액션 처리기
    const executeAction = (action: GameAction) => {
      switch (action.type) {
        case 'MOVE':
          return engine.move(action.direction)
        case 'SPACE_ACTION':
          return engine.processTileAction()
        case 'ENTER_ACTION':
          return console.log('Enter Action')
      }
    }

    // 키보드 리스너
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = mapKeyboardToResponse(e)
      if (action) executeAction(action)
    }

    // 게임패드 루프
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : []
      const gamepad = gamepads[0]

      if (gamepad) {
        const now = performance.now()
        if (now - lastGamepadTime.current >= gamepadCooldownMS) {
          const action = mapGamepadToResponse(gamepad)
          if (action) {
            executeAction(action)
            lastGamepadTime.current = now
          }
        }
      }
    }

    // 등록 및 시작
    window.addEventListener('keydown', handleKeyDown)

    let frameId: number
    const loop = () => {
      checkGamepad()
      frameId = requestAnimationFrame(loop)
    }
    frameId = requestAnimationFrame(loop)

    // 해제
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      cancelAnimationFrame(frameId)
    }
  }, [engine])
}
