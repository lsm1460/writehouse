import { Cell_g } from './Cell_g'
import { Cell_i } from './Cell_i'
import { CellE } from './CellE'
import { CellF } from './CellF'
import { CellG } from './CellG'
import { CellL } from './CellL'
import { CellO } from './CellO'
import { CellT } from './CellT'
import { CellW } from './CellW'

export const CELL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  L: CellL,
  G: CellG,
  g: Cell_g,
  T: CellT,
  i: Cell_i,
  F: CellF,
  f: CellF,
  W: CellW,
  w: CellW,
  E: CellE,
  1: CellE,
  8: CellE,
  O: CellO
}