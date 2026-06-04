import type { GameAction } from './types'

export function mapKeyboardToResponse(e: KeyboardEvent): GameAction | null {
  const code = e.code

  if (['KeyW', 'ArrowUp'].includes(code)) return { type: 'MOVE', direction: 'UP' }
  if (['KeyS', 'ArrowDown'].includes(code)) return { type: 'MOVE', direction: 'DOWN' }
  if (['KeyA', 'ArrowLeft'].includes(code)) return { type: 'MOVE', direction: 'LEFT' }
  if (['KeyD', 'ArrowRight'].includes(code)) return { type: 'MOVE', direction: 'RIGHT' }

  if (code === 'Space') return { type: 'SPACE_ACTION' }
  if (code === 'Enter') return { type: 'ENTER_ACTION' }
  if (code === 'KeyR') return { type: 'RETRY_ACTION' }
  if (code === 'Escape') return { type: 'MENU' }

  return null
}
