import type { GameAction } from './types'

export function mapKeyboardToResponse(e: KeyboardEvent): GameAction | null {
  // 이동 키 매핑
  if (e.key === 'ArrowUp') return { type: 'MOVE', direction: 'UP' }
  if (e.key === 'ArrowDown') return { type: 'MOVE', direction: 'DOWN' }
  if (e.key === 'ArrowLeft') return { type: 'MOVE', direction: 'LEFT' }
  if (e.key === 'ArrowRight') return { type: 'MOVE', direction: 'RIGHT' }

  // 액션 키 매핑
  if (e.key === ' ') return { type: 'SPACE_ACTION' }
  if (e.key === 'Enter') return { type: 'ENTER_ACTION' }

  return null // 매핑되지 않은 키는 무시
}
