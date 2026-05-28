import type { GameAction } from "./types"

export function mapGamepadToResponse(gamepad: Gamepad): GameAction | null {
  // 1. 십자키(D-Pad) 매핑
  if (gamepad.buttons[12]?.pressed) return { type: 'MOVE', direction: 'UP' }
  if (gamepad.buttons[13]?.pressed) return { type: 'MOVE', direction: 'DOWN' }
  if (gamepad.buttons[14]?.pressed) return { type: 'MOVE', direction: 'LEFT' }
  if (gamepad.buttons[15]?.pressed) return { type: 'MOVE', direction: 'RIGHT' }

  // 2. 아날로그 스틱 매핑 (기울기 임계값 0.5)
  const xAxis = gamepad.axes[0]
  const yAxis = gamepad.axes[1]
  if (yAxis < -0.5) return { type: 'MOVE', direction: 'UP' }
  if (yAxis > 0.5) return { type: 'MOVE', direction: 'DOWN' }
  if (xAxis < -0.5) return { type: 'MOVE', direction: 'LEFT' }
  if (xAxis > 0.5) return { type: 'MOVE', direction: 'RIGHT' }

  // 3. 기능 버튼 매핑 (A, B, 범퍼 키)
  if (gamepad.buttons[0]?.pressed) return { type: 'SPACE_ACTION' } // A
  if (gamepad.buttons[1]?.pressed) return { type: 'SPACE_ACTION' } // B

  if (gamepad.buttons[9]?.pressed) return { type: 'MENU' }
  
  return null
}
