import { useMemo } from 'react'

export function CellT() {
  const randomDelay = useMemo(() => `${(Math.random() * -3).toFixed(1)}s`, [])

  return (
    <span
      className="animate-tree-sway text-green-600 font-extrabold drop-shadow-[0_0_3px_rgba(22,163,74,0.4)]"
      style={{ userSelect: 'none', animationDelay: randomDelay }}
    >
      T
    </span>
  )
}
