export function CellA() {
  return (
    <span
      className="text-orange-500 font-black animate-pulse text-center select-none"
      style={{
        background: 'linear-gradient(to top, #ef4444, #f97316, #fde047)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: `
          drop-shadow(0 0 2px rgba(239, 68, 68, 0.8)) 
          drop-shadow(0 4px 6px rgba(249, 115, 22, 0.4)) 
          drop-shadow(0 -1px 3px rgba(0, 0, 0, 0.9))
        `,
        textShadow: '0 0 4px rgba(220, 38, 38, 0.6)'
      }}
    >
      A
    </span>
  )
}