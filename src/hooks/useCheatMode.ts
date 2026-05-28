import { useRef, useState } from 'react'
import type { GameAction } from '~/hooks/input/types'

const KONAMI_COMMANDS = [
  'UP', 'UP', 
  'DOWN', 'DOWN', 
  'LEFT', 'RIGHT', 
  'LEFT', 'RIGHT', 
  'SPACE_ACTION', 
  'ENTER_ACTION'
]

export function useCheatMode() {
  const [cheatMode, setCheatMode] = useState(false)
  const inputHistory = useRef<string[]>([])

  const handleActionReport = (action: GameAction) => {
    let inputToken: string | null = null

    if (action.type === 'MOVE') {
      inputToken = action.direction // 'UP', 'DOWN', 'LEFT', 'RIGHT'
    } else if (action.type === 'SPACE_ACTION' || action.type === 'ENTER_ACTION') {
      inputToken = action.type // 'SPACE_ACTION', 'ENTER_ACTION'
    }

    if (inputToken) {
      inputHistory.current.push(inputToken)

      if (inputHistory.current.length > KONAMI_COMMANDS.length) {
        inputHistory.current.shift()
      }

      if (inputHistory.current.join(',') === KONAMI_COMMANDS.join(',')) {
        setCheatMode(true)
        inputHistory.current = [] // 매칭 성공 후 버퍼 초기화
      }
    }
  }

  const closeCheatMode = () => setCheatMode(false)

  return {
    cheatMode,
    handleActionReport,
    closeCheatMode,
  }
}