import { useGame } from '~/context/GameContext'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'
import { QuickSlots } from './QuickSlots'

export function GameUi() {
  const { scale } = useWindowScale()
  const { inventory } = useGame()

  return (
    <div
      className="fixed bottom-0 left-1/2 pb-5 w-full -translate-x-1/2 flex flex-col gap-4"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center bottom',
      }}
    >
      <QuickSlots inventorySystem={inventory} />
      <div className="w-full text-center text-xs text-neutral-500 font-mono">
        [WASD]: Move | [Space]: Action | [R]: Retry Stage
      </div>
    </div>
  )
}
