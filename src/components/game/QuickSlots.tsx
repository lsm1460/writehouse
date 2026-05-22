import { EngineContext } from '~/core/engineContext'

interface QuickSlotsProps {
  inventorySystem: EngineContext['inventory']
}

export function QuickSlots({ inventorySystem }: QuickSlotsProps) {
  const { currentItem } = inventorySystem
  const hasItem = !!currentItem?.char?.trim()

  const slotClass = `
    relative w-8 h-8 flex items-center justify-center text-2xl font-bold rounded border transition-all duration-100
    ${
      hasItem
        ? 'border-green-500 bg-neutral-900 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-105 z-10'
        : 'border-neutral-800 bg-neutral-950 text-neutral-600'
    }
  `

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex bg-black border border-neutral-800 p-1 rounded shadow-2xl">
        <div className={slotClass}>
          <span className={hasItem ? 'animate-pulse' : ''}>
            {hasItem ? currentItem?.char : ' '}
          </span>
        </div>
      </div>
    </div>
  )
}