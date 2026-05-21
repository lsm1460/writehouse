export const MIX_RECIPES: Record<string, string> = {
  I_: 'L',
}

export function getMixedChar(charA: string, charB: string): string | null {
  const key = [charA, charB].sort().join('')
  return MIX_RECIPES[key] || null
}
