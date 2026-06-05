interface CellMProps {
  char: string
  tile: { direction?: string }
  lightLevel: number
}

export function CellM({ char, tile, lightLevel }: CellMProps) {
  if (lightLevel <= 0) {
    return <div className="w-full h-full bg-black" />
  }

  const direction = tile?.direction
  const isLeft = direction === 'LEFT'
  const isUp = direction === 'UP'
  const isDown = direction === 'DOWN'

  const visibilityOpacity = Math.min(0.3 + lightLevel / 10, 1)
  console.log('visibilityOpacity',visibilityOpacity)
  let shadowX = '4px'
  let shadowY = '4px'
  if (isLeft) shadowX = '-4px'
  if (isUp) {
    shadowX = '0px'
    shadowY = '-4px'
  }
  if (isDown) {
    shadowX = '0px'
    shadowY = '6px'
  }

  return (
    <span
      className="font-black text-center select-none transition-all duration-150 inline-block animate-breathe origin-bottom"
      style={{
        color: '#f97316',
        filter: `drop-shadow(${shadowX} ${shadowY} 6px rgba(251, 146, 6, 0.85))`,
        textShadow: '2px 2px 2px rgba(0, 0, 0, 1)', // 어두운 곳에서도 몬스터 글자가 묻히지 않게 마감
        opacity: visibilityOpacity,
      }}
    >
      {char}
    </span>
  )
}
