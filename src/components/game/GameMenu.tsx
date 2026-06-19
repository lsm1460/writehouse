import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '~/context/GameContext'
import { FadeOverlay } from '../ui/FadeOverlay'
import { GameMenuLayout } from '../ui/GameMenuLayout'
import { ConfigScreen } from '../screens/ConfigScreen'

interface MenuProps {
  onResume: () => void
  onRestart: () => void
  onExit: () => void
}

export function GameMenu({ onResume, onRestart, onExit }: MenuProps) {
  const { t } = useTranslation()
  const { engine } = useGame()
  const [showConfig, setShowConfig] = useState(false)

  if (showConfig) {
    return (
      <FadeOverlay delayMS={0} durationMS={200} midDelayMS={999999}>
        <ConfigScreen backToTitle={() => setShowConfig(false)} />
      </FadeOverlay>
    )
  }

  const menuItems = [
    { label: t('ui.resume'), action: onResume },
    { label: t('ui.retry'), action: onRestart },
    { label: t('ui.config'), action: () => setShowConfig(true) },
    { label: t('ui.backToTitle'), action: onExit },
  ]

  return (
    <FadeOverlay delayMS={0} durationMS={200} midDelayMS={999999}>
      <div className="flex flex-col items-center justify-center relative w-full h-full">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-400 uppercase tracking-tighter">Pause</h2>
        </div>
        <GameMenuLayout engine={engine} menuItems={menuItems} />
      </div>
    </FadeOverlay>
  )
}
