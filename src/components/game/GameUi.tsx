import { useTranslation } from 'react-i18next'
import { useGame } from '~/context/GameContext'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'
import { useGamepadActive } from '~/hooks/input/useGameInput'

export function GameUi() {
  const { t } = useTranslation()
  const { player } = useGame()
  const { isReady, scale } = useWindowScale()
  const isGamepadActive = useGamepadActive()

  if (!isReady) return

  return (
    <div
      className="fixed bottom-0 left-1/2 pb-5 w-full -translate-x-1/2 flex flex-col gap-2"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center bottom',
      }}
    >
      {/* <QuickSlots inventorySystem={inventory} /> */}

      <p className="flex items-center justify-center gap-x-3 font-mono text-xs text-neutral-500">
        <span>
          ({player.pos.x}.{player.pos.y})
        </span>
      </p>

      <div className="w-full text-center text-xs text-neutral-500 font-mono">
        {isGamepadActive ? (
          <>
            [DPAD/STICK]: {t('ui.move')} | [A/B]: {t('ui.undo')} | [START]: {t('ui.menu')}
          </>
        ) : (
          <>
            [WASD / Arrows]: {t('ui.move')} | [Space]: {t('ui.undo')} | [R]: {t('ui.retry')} | [ESC]: {t('ui.menu')}
          </>
        )}
      </div>
    </div>
  )
}
