import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '~/context/GameContext'
import { GameMenuLayout } from '../ui/GameMenuLayout'
import { ScreenWrapper } from './ScreenWrapper'

interface TitleScreenProps {
  onStart: () => void
  onLoad?: () => void
  onConfig: () => void
  onExit: () => void
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onLoad, onConfig, onExit }) => {
  const { t } = useTranslation()
  const { engine, isGameClear } = useGame()
  
  const menuItems = [
    { label: t('ui.new_game'), action: onStart },
    ...(onLoad ? [{ label: t('ui.load'), action: onLoad }] : []),
    { label: t('ui.config'), action: onConfig },
    { label: t('ui.exit'), action: onExit },
  ]

  return (
    <ScreenWrapper className="pt-10 pb-5">
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-black text-white tracking-tighter animate-pulse">
          WRITE
          <br />
          HOUSE
        </h1>
      </div>

      <GameMenuLayout engine={engine} menuItems={menuItems} />

      <div className="mt-10 pb-4 text-neutral-600 text-xs">
        © 2026 WriteHouse Studio. All rights reserved.
      </div>
    </ScreenWrapper>
  )
}
