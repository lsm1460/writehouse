export function getTileContext(
  char: string,
  contextData: { stageClear: boolean; isActive: boolean; isWet: boolean; isElectrified: boolean }
): string | undefined {
  switch (char) {
    case 'G':
      return contextData.stageClear ? 'open' : 'closed'
    case 'i':
      return contextData.isActive ? 'active' : 'inactive'
    case 'g':
      return contextData.isElectrified ? 'el' : contextData.isWet ? 'wet' : ''
    default:
      return undefined
  }
}

export const OPACITY_LEVELS = [0.15, 0.6, 0.75, 0.9, 1.0]
export const getOpacity = (level: number) => OPACITY_LEVELS[level] ?? 1.0
