import { type Direction } from '~/core/types'

export type GameAction =
  | { type: 'MOVE'; direction: Direction }
  | { type: 'SPACE_ACTION' }
  | { type: 'ENTER_ACTION' }
  | { type: 'SELECT_SLOT'; slot: number }
