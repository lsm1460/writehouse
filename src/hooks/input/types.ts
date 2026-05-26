import { type Direction } from '~/core/types'

export type GameAction =
  | { type: 'MOVE'; direction: Direction }
  | { type: 'SPACE_ACTION' }
  | { type: 'RETRY_ACTION' }
  | { type: 'MENU' }
