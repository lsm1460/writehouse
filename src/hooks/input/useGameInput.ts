import { useEffect, useRef, useState } from 'react'
import { GameEngine } from '~/core/gameEngine'
import { mapGamepadToResponse } from './gamepadAction'
import { mapKeyboardToResponse } from './keyboardAction'
import type { GameAction } from './types'

let isGamepadActiveGlobal = false
const gamepadStateSubscribers = new Set<(active: boolean) => void>()

export function useGamepadActive() {
  const [isActive, setIsActive] = useState(isGamepadActiveGlobal)
  useEffect(() => {
    const handle = (active: boolean) => setIsActive(active)
    gamepadStateSubscribers.add(handle)
    return () => {
      gamepadStateSubscribers.delete(handle)
    }
  }, [])
  return isActive
}

function setGamepadActive(active: boolean) {
  if (isGamepadActiveGlobal !== active) {
    isGamepadActiveGlobal = active
    gamepadStateSubscribers.forEach((cb) => cb(active))
  }
}

interface UseGameInputProps {
  engine: GameEngine
  onMenuUp?: () => void
  onMenuDown?: () => void
  onMenuLeft?: () => void
  onMenuRight?: () => void
  onMenuSelect?: () => void
  onAction?: (action: GameAction) => void
  disabled?: boolean
  passive?: boolean
  openMenu?: () => void
}

// 입력 루프 목표 FPS 설정 (60FPS 기준 약 16.6ms 간격)
const INPUT_TARGET_FPS = 30
const INPUT_FRAME_INTERVAL = 1000 / INPUT_TARGET_FPS

export function useGameInput({ engine, onMenuUp, onMenuDown, onMenuLeft, onMenuRight, onMenuSelect, onAction, openMenu, disabled = false, passive = false }: UseGameInputProps) {
  const activeCodes = useRef<Record<string, boolean>>({})

  const lastKeyboardTimes = useRef<Record<string, number>>({})
  const lastGamepadMoveTimes = useRef<Record<string, number>>({})

  // 직전 프레임의 패드 액션 상태 기억 (이벤트 감지용)
  const previousGamepadActions = useRef<Set<string>>(new Set())

  const gamepadMoveCooldownMS = 200
  const keyboardCooldownMS = 150

  const executeAction = (action: GameAction) => {
    if (onAction) {
      onAction(action)
    }

    if (passive) {
      return
    }

    if (['TITLE', 'PAUSE', 'GAME_OVER', 'ENDING'].includes(engine.gameStatus)) {
      switch (action.type) {
        case 'MOVE':
          if (action.direction === 'UP' && onMenuUp) onMenuUp()
          if (action.direction === 'DOWN' && onMenuDown) onMenuDown()
          if (action.direction === 'LEFT' && onMenuLeft) onMenuLeft()
          if (action.direction === 'RIGHT' && onMenuRight) onMenuRight()
          break
        case 'SPACE_ACTION':
        case 'ENTER_ACTION':
          if (onMenuSelect) onMenuSelect()
          break
      }
      return
    }

    switch (action.type) {
      case 'MOVE':
        if (engine.gameStatus === 'PLAYING') {
          return engine.move(action.direction)
        }
        break
      case 'MENU':
        openMenu && openMenu()
        break
      case 'SPACE_ACTION':
        return engine.undo()
      case 'RETRY_ACTION':
        return engine.retryStage()
    }
  }

  // 1. 키보드 입력 처리
  const processKeyboardInput = (now: number) => {
    for (const code in activeCodes.current) {
      if (activeCodes.current[code]) {
        const lastTime = lastKeyboardTimes.current[code] || 0

        if (now - lastTime >= keyboardCooldownMS) {
          const fakeEvent = { code } as KeyboardEvent
          const action = mapKeyboardToResponse(fakeEvent)
          if (action) {
            executeAction(action)
            lastKeyboardTimes.current[code] = now
          }
        }
      }
    }
  }

  // 2. [단순 체크] 패드가 현재 누르고 있는 모든 액션을 식별자(Set)로만 수집
  const pollGamepadActions = (): { action: GameAction; key: string } | null => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : []
    const gamepad = gamepads[0]

    if (!gamepad) return null

    const action = mapGamepadToResponse(gamepad)
    if (!action) return null

    const key = action.type === 'MOVE' ? `MOVE_${action.direction}` : action.type

    return { action, key }
  }

  // 3. [동작 인식 Engine] 이전 프레임과 비교해 Edge Trigger(KeyDown/Hold) 발생
  const processGamepadInput = (now: number) => {
    const current = pollGamepadActions()
    const prevSet = previousGamepadActions.current
    const currSet = new Set<string>()

    if (current) {
      setGamepadActive(true)
      currSet.add(current.key)

      const isNewPress = !prevSet.has(current.key)

      if (isNewPress) {
        // [Key Down Event] 버튼을 처음 누른 순간 -> 1회 실행
        executeAction(current.action)
        if (current.action.type === 'MOVE') {
          lastGamepadMoveTimes.current[current.key] = now
        }
      } else {
        // [Key Hold Event] 누르고 있는 상태 유지 -> 이동(MOVE)만 쿨다운 주기로 연사 허용
        if (current.action.type === 'MOVE') {
          const lastTime = lastGamepadMoveTimes.current[current.key] || 0
          if (now - lastTime >= gamepadMoveCooldownMS) {
            executeAction(current.action)
            lastGamepadMoveTimes.current[current.key] = now
          }
        }
      }
    }

    // 다음 프레임을 위한 상태 갱신
    previousGamepadActions.current = currSet
  }

  useEffect(() => {
    // 입력 상태를 완전 초기화하는 함수
    const flushInputState = () => {
      activeCodes.current = {}
      previousGamepadActions.current.clear()
    }

    if (disabled) {
      flushInputState()
      return
    }

    // 마운트 시점에 이미 눌려 있는 게임패드 버튼을 이전 상태(prevSet)로 사전 흡수(Consume)
    const currentGamepad = pollGamepadActions()
    if (currentGamepad) {
      previousGamepadActions.current.add(currentGamepad.key)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      setGamepadActive(false)

      if (['ArrowUp', 'ArrowDown', 'Space', 'Enter'].includes(e.code) && engine.gameStatus === 'TITLE') {
        e.preventDefault()
      }

      if (!activeCodes.current[e.code]) {
        activeCodes.current[e.code] = true
        const now = performance.now()
        const lastTime = lastKeyboardTimes.current[e.code] || 0

        if (now - lastTime >= keyboardCooldownMS) {
          const action = mapKeyboardToResponse(e)
          if (action) {
            executeAction(action)
            lastKeyboardTimes.current[e.code] = now
          }
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      activeCodes.current[e.code] = false
    }

    const handleBlur = () => {
      flushInputState()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    let frameId: number
    let lastInputLoopTime = performance.now()

    const loop = () => {
      frameId = requestAnimationFrame(loop)
      const now = performance.now()
      const elapsed = now - lastInputLoopTime

      // 설정한 FPS 주기마다만 입력 검사 실행
      if (elapsed >= INPUT_FRAME_INTERVAL) {
        lastInputLoopTime = now - (elapsed % INPUT_FRAME_INTERVAL)
        processKeyboardInput(now)
        processGamepadInput(now)
      }
    }

    frameId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
      cancelAnimationFrame(frameId)
      flushInputState()
    }
  }, [engine, onMenuUp, onMenuDown, onMenuLeft, onMenuRight, onMenuSelect, disabled])
}