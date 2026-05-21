interface CellProps {
  stageClear: boolean
}

export function CellG({ stageClear }: CellProps) {
  const themeClass = stageClear ? 'text-emerald-400 font-black' : 'text-neutral-500 font-bold line-through opacity-80'

  return <span className={themeClass}>G</span>
}
