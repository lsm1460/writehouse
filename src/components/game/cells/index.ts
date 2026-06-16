import { Cell_g } from './Cell_g'
import { Cell_i } from './Cell_i'
import { CellA } from './CellA'
import { CellD } from './CellD'
import { CellE } from './CellE'
import { CellF } from './CellF'
import { CellG } from './CellG'
import { CellL } from './CellL'
import { CellM } from './CellM'
import { CellO } from './CellO'
import { CellSensor } from './CellSensor'
import { CellT } from './CellT'
import { CellW } from './CellW'
import { CellWPT } from './CellWPT'

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
  O: CellO,
  A: CellA,
  M: CellM,
  m: CellM,
  D: CellD,
  Ↄ: CellSensor,
  Э: CellWPT
}
