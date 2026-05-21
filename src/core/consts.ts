export const CARDINAL_DIRECTIONS = [
  [0, -1], // 상
  [0, 1], // 하
  [-1, 0], // 좌
  [1, 0], // 우
] as const

export const COMPASS_DIRECTIONS = [
  [-1, -1],
  [0, -1],
  [1, -1], // 좌상, 상, 우상
  [-1, 0],
  [1, 0], // 좌,     우
  [-1, 1],
  [0, 1],
  [1, 1], // 좌하, 하, 우하
] as const
