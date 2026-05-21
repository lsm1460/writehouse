import { Cell_g } from './Cell_g'
import { Cell_i } from './Cell_i'
import { CellF } from './CellF'
import { CellG } from './CellG'
import { CellL } from './CellL'
import { CellT } from './CellT'

export const CELL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  L: CellL,
  G: CellG,
  g: Cell_g,
  T: CellT,
  i: Cell_i,
  F: CellF,
  f: CellF,
}