export const MIX_RECIPES: Record<string, string> = {
  I_: 'L',
  Fg: 'F',
  FT: 'F',
  fg: 'f',
  Tf: 'F'
}

export function getMixedChar(charA: string, charB: string): string | null {
  const key = [charA, charB].sort().join('')
  
  return MIX_RECIPES[key] || null
}
