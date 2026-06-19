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
  onMenuSelect?: () => void
  onAction?: (action: GameAction) => void
  disabled?: boolean
  passive?: boolean
}

export function useGameInput({
  engine,
  onMenuUp,
  onMenuDown,
  onMenuSelect,
  onAction,
  disabled = false,
  passive = false,
}: UseGameInputProps) {
  const lastGamepadTime = useRef<number>(0)
  const activeCodes = useRef<Record<string, boolean>>({})

  const lastExecutedTimes = useRef<Record<string, number>>({})

  const gamepadCooldownMS = 200
  const keyboardCooldownMS = 150

  const executeAction = (action: GameAction) => {
    if (onAction) {
      onAction(action)
    }

    if (passive) {
      return
    }

    if (['TITLE', 'MENU', 'GAME_OVER'].includes(engine.gameStatus)) {
      switch (action.type) {
        case 'MOVE':
          if (action.direction === 'UP' && onMenuUp) onMenuUp()
          if (action.direction === 'DOWN' && onMenuDown) onMenuDown()
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
        return engine.toggleMenu()
      case 'SPACE_ACTION':
        return engine.undo()
      case 'RETRY_ACTION':
        return engine.retryStage()
    }
  }

  const checkKeyboard = (now: number) => {
    for (const code in activeCodes.current) {
      if (activeCodes.current[code]) {
        const lastTime = lastExecutedTimes.current[code] || 0

        if (now - lastTime >= keyboardCooldownMS) {
          const fakeEvent = { code } as KeyboardEvent
          const action = mapKeyboardToResponse(fakeEvent)
          if (action) {
            executeAction(action)
            lastExecutedTimes.current[code] = now
          }
        }
      }
    }
  }

  const checkGamepad = (now: number) => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : []
    const gamepad = gamepads[0]

    if (gamepad && now - lastGamepadTime.current >= gamepadCooldownMS) {
      const action = mapGamepadToResponse(gamepad)
      if (action) {
        setGamepadActive(true)
      }
    }
  }

  useEffect(() => {
    if (disabled) {
      activeCodes.current = {}
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      setGamepadActive(false)

      if (['ArrowUp', 'ArrowDown', 'Space', 'Enter'].includes(e.code) && engine.gameStatus === 'TITLE') {
        e.preventDefault()
      }

      if (!activeCodes.current[e.code]) {
        activeCodes.current[e.code] = true
        const now = performance.now()
        const lastTime = lastExecutedTimes.current[e.code] || 0

        if (now - lastTime >= keyboardCooldownMS) {
          const action = mapKeyboardToResponse(e)
          if (action) {
            executeAction(action)
            lastExecutedTimes.current[e.code] = now
          }
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      activeCodes.current[e.code] = false
    }

    const handleBlur = () => {
      activeCodes.current = {}
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    let frameId: number

    const loop = () => {
      const now = performance.now()
      checkKeyboard(now)
      checkGamepad(now)
      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
      cancelAnimationFrame(frameId)
      activeCodes.current = {}
    }
  }, [engine, onMenuUp, onMenuDown, onMenuSelect, disabled])
}
