import { useWindowScale } from '~/hooks/input/ui/useWindowScale'

export function GameUi() {
  const { scale } = useWindowScale()

  return (
    <div
      className="fixed bottom-0 left-1/2 pb-5 w-full -translate-x-1/2 flex flex-col gap-4"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center bottom',
      }}
    >
      {/* <QuickSlots inventorySystem={inventory} /> */}
      <div className="w-full text-center text-xs text-neutral-500 font-mono">
        [WASD]: Move | [R]: Retry Stage
      </div>
    </div>
  )
}
