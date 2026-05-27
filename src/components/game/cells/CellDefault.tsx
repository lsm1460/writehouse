import type { Tile } from "~/core/map/Tile"
import type { LightState } from "~/core/types"

interface CellProps {
  char: string
  tile: Tile
  lightState: LightState
  stageClear: boolean
}

export function CellDefault({ char }: CellProps) {
  return <>{char}</>
}
