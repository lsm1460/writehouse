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
  passive = false
}: UseGameInputProps) {
  const lastGamepadTime = useRef<number>(0)
  const lastKeyboardTime = useRef<number>(0)
  const activeKeys = useRef<Record<string, boolean>>({})

  const gamepadCooldownMS = 200
  const keyboardCooldownMS = 150
  const fpsLimit = 30
  const frameInterval = 1000 / fpsLimit

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
    let hasActiveKey = false
    for (const key in activeKeys.current) {
      if (activeKeys.current[key]) {
        hasActiveKey = true
        break
      }
    }

    if (hasActiveKey && now - lastKeyboardTime.current >= keyboardCooldownMS) {
      for (const key in activeKeys.current) {
        if (activeKeys.current[key]) {
          const fakeEvent = { key } as KeyboardEvent
          const action = mapKeyboardToResponse(fakeEvent)
          if (action) {
            executeAction(action)
            lastKeyboardTime.current = now
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
      activeKeys.current = {}
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      setGamepadActive(false)
      if (['ArrowUp', 'ArrowDown', ' ', 'Enter'].includes(e.key) && engine.gameStatus === 'TITLE') {
        e.preventDefault()
      }
      activeKeys.current[e.key] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeys.current[e.key] = false
    }

    const handleBlur = () => {
      activeKeys.current = {}
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    let frameId: number
    let lastFrameTime = performance.now()

    const loop = () => {
      const now = performance.now()
      const elapsed = now - lastFrameTime

      if (elapsed >= frameInterval) {
        lastFrameTime = now - (elapsed % frameInterval)
        checkKeyboard(now)
        checkGamepad(now)
      }

      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
      cancelAnimationFrame(frameId)
      activeKeys.current = {}
    }
  }, [engine, onMenuUp, onMenuDown, onMenuSelect, disabled, frameInterval])
}