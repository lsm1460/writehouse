export const MIX_RECIPES: Record<string, string> = {
  I_: 'L',
  Fg: 'F',
  FT: 'F',
  fg: 'f',
  Tf: 'F',
  '=I': 'F',
  FI: 'A',
  If: 'A',
  Fw: ' ',
  FW: ' ',
  F_: 'E',
  _f: 'E',
  '=L': 'E',
  'I≡': 'E',
  A_: '8',
  EI: '8',
  OO: '8',
  IↃ: 'D',
  '=_': '≡',
  '_Ↄ': 'Э'
}

export function getMixedChar(charA: string, charB: string): string | null {
  const key = [charA, charB].sort().join('')
  
  return MIX_RECIPES[key] || null
}
