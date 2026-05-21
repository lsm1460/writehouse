import { CellG } from './CellG'
import { Celli } from './Celli'
import { CellL } from './CellL'

export const CELL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  L: CellL,
  G: CellG,
  i: Celli,
}