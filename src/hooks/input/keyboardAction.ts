import type { GameAction } from './types'

export function mapKeyboardToResponse(e: KeyboardEvent): GameAction | null {
  // 이동 키 매핑
  const _key = e.key.toLowerCase()
  
  if (_key === 'w') return { type: 'MOVE', direction: 'UP' }
  if (_key === 's') return { type: 'MOVE', direction: 'DOWN' }
  if (_key === 'a') return { type: 'MOVE', direction: 'LEFT' }
  if (_key === 'd') return { type: 'MOVE', direction: 'RIGHT' }

  // 액션 키 매핑
  if (_key === ' ') return { type: 'SPACE_ACTION' }
  if (_key === 'r') return { type: 'RETRY_ACTION' }
  if (_key === 'escape') return { type: 'MENU' }

  return null // 매핑되지 않은 키는 무시
}
