import { useTranslation } from 'react-i18next'
import { useGame } from '~/context/GameContext'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'
import { useGamepadActive } from '~/hooks/input/useGameInput'

// 타일별 실시간 상태(Context)를 결정하는 헬퍼 함수
function getTileContext(
  char: string,
  contextData: { stageClear: boolean; isActive: boolean; isWet: boolean; isElectrified: boolean }
): string | undefined {
  switch (char) {
    case 'G': // 문 타일
      return contextData.stageClear ? 'open' : 'closed'
    case 'i': // 빛 수신기 타일
      return contextData.isActive ? 'active' : 'inactive'
    case 'g': // 빛 수신기 타일
      return contextData.isElectrified ? 'el' : contextData.isWet ? 'wet' : ''
    default:
      return undefined
  }
}

export function GameUi() {
  const { t } = useTranslation()
  const { map, stageClear, fog } = useGame()
  const { isReady, scale } = useWindowScale()
  const isGamepadActive = useGamepadActive()

  const target = map.getTargetTile()
  const charKey = target?.char?.trim()
  
  const isLightActive =
    target && charKey === 'i' ? fog.getLightState(target.x, target.y).environmentIntensity > 0 : false

  const tileContext = charKey
    ? getTileContext(charKey, {
        stageClear,
        isActive: isLightActive,
        isWet: target?.isWet || false,
        isElectrified: target?.isElectrified || false,
      })
    : undefined
    
  const label = t(`char.${charKey}.label`, { context: tileContext, defaultValue: '' })
  const example = charKey ? t(`char.${charKey}.example`, { defaultValue: '' }) : ''

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

      {label && (
        <p className="flex items-center justify-center gap-x-3 font-mono text-xs text-neutral-500">
          <span>{label}</span>

          {example && (
            <span className="flex items-center gap-x-1.5">
              <span className="text-neutral-600 text-[10px] uppercase tracking-wider">ex: </span>
              <span className="text-neutral-400 font-bold">{example}</span>
            </span>
          )}
        </p>
      )}

      <div className="w-full text-center text-xs text-neutral-500 font-mono">
        {isGamepadActive ? (
          <>
            [DPAD/STICK]: {t('ui.move')} | [A/B]: {t('ui.undo')} | [START]: {t('ui.menu')}
          </>
        ) : (
          <>
            [WASD]: {t('ui.move')} | [Space]: {t('ui.undo')} | [R]: {t('ui.retry')} | [ESC]: {t('ui.menu')}
          </>
        )}
      </div>
    </div>
  )
}
