import { useMemo } from 'react'

export function Cell_g() {
  const randomDelay = useMemo(() => `${(Math.random() * -2).toFixed(1)}s`, [])
  
  return (
    <span 
      className="animate-grass-sway text-emerald-400 font-medium tracking-wider drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]"
      style={{ userSelect: 'none', animationDelay: randomDelay }}
    >
      g
    </span>
  )
}