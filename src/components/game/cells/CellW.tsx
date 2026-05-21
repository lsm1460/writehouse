import { useMemo } from 'react'

interface CellProps {
  char: string
}

export function CellW({ char }: CellProps) {
  const randomDelay = useMemo(() => `${(Math.random() * -2).toFixed(1)}s`, [])

  if (char === 'W') {
    return (
      <span
        className="animate-water-W font-black"
        style={{ userSelect: 'none' }}
      >
        W
      </span>
    )
  }

  return (
    <span
      className="animate-water-w font-bold"
      style={{ animationDelay: randomDelay, userSelect: 'none' }}
    >
      w
    </span>
  )
}