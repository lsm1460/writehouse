interface CellProps {
  char: string
}

export function CellF({ char }: CellProps) {
  return (
    <span
      className="text-yellow-300 font-black animate-fire text-center"
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.5))',
      }}
    >
      {char}
    </span>
  )
}
