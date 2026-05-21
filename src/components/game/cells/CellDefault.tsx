interface CellProps {
  char: string
}

export function CellDefault({ char }: CellProps) {
  return <>{char}</>
}
