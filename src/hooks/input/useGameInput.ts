import { useEffect, useRef } from 'react'
import { GameEngine } from '~/core/gameEngine'
import { mapGamepadToResponse } from './gamepadAction'
import { mapKeyboardToResponse } from './keyboardAction'
import type { GameAction } from './types'

interface UseGameInputProps {
  engine: GameEngine
  onMenuUp?: () => void
  onMenuDown?: () => void
  onMenuSelect?: () => void
}

export function useGameInput({ engine, onMenuUp, onMenuDown, onMenuSelect }: UseGameInputProps) {
  const lastGamepadTime = useRef<number>(0)
  const lastKeyboardTime = useRef<number>(0)
  
  const gamepadCooldownMS = 200
  const keyboardCooldownMS = 200 
  const activeKeys = useRef<Record<string, boolean>>({})

  useEffect(() => {
    const executeAction = (action: GameAction) => {
      if (engine.gameStatus === 'TITLE' || engine.gameStatus === 'MENU') {
        switch (action.type) {
          case 'MOVE':
            if (action.direction === 'UP' && onMenuUp) onMenuUp()
            if (action.direction === 'DOWN' && onMenuDown) onMenuDown()
            break
          case 'SPACE_ACTION':
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
        case 'SPACE_ACTION':
          if (engine.gameStatus === 'GAME_OVER') {
            return engine.retryStage()
          }
          return engine.processTileAction()
        case 'RETRY_ACTION':
          return engine.retryStage()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
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

      if (gamepad) {
        if (now - lastGamepadTime.current >= gamepadCooldownMS) {
          const action = mapGamepadToResponse(gamepad)
          if (action) {
            executeAction(action)
            lastGamepadTime.current = now
          }
        }
      }
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
      activeKeys.current = {}
    }
  }, [engine, onMenuUp, onMenuDown, onMenuSelect])
}