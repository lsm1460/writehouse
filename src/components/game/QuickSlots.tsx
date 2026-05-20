import { EngineContext } from '~/core/engineContext'

interface QuickSlotsProps {
  inventorySystem: EngineContext['inventory']
}

export function QuickSlots({ inventorySystem }: QuickSlotsProps) {
  const { quickSlots, slotIndex, itemCounts } = inventorySystem

  return (
    <div className="flex flex-col items-center gap-2 mt-4 font-mono select-none">
      <div className="flex gap-3 bg-black border border-neutral-800 p-2 rounded shadow-2xl">
        {quickSlots.map((item, index) => {
          const isSelected = slotIndex === index
          const hasItem = item.trim() !== ''
          const count = hasItem ? itemCounts[item] || 0 : 0

          const slotClass = `
            relative w-12 h-12 flex items-center justify-center text-2xl font-bold rounded border transition-all duration-100
            ${
              isSelected
                ? 'border-green-500 bg-neutral-900 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-105 z-10'
                : 'border-neutral-700 bg-neutral-950 text-neutral-400 hover:border-neutral-500'
            }
          `

          return (
            <div key={index} className={slotClass}>
              <span className="absolute top-0.5 left-1 text-[9px] text-neutral-600 font-black">{index + 1}</span>

              <span className={isSelected ? 'animate-pulse' : ''}>{hasItem ? item : ' '}</span>

              {hasItem && (
                <span
                  className={`absolute bottom-0.5 right-1 text-[10px] font-sans px-0.5 rounded
                  ${isSelected ? 'text-green-300 bg-green-950' : 'text-neutral-500 bg-neutral-900'}
                `}
                >
                  {count}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
