interface CellProps {
  char: string
}

export function CellSensor({ char }: CellProps) {
  return <span className="font-mono">{char}</span>
}
