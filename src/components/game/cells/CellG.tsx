interface CellProps {
  stageClear: boolean
}

export function CellG({ stageClear }: CellProps) {
  const themeClass = stageClear 
    ? 'text-red-500 font-black drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]' 
    : 'text-neutral-500 font-bold line-through opacity-80'

  return <span className={themeClass}>⚑</span>
}