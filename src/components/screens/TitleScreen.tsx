import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '~/context/GameContext'
import { GameMenuLayout } from '../ui/GameMenuLayout'
import { TitleBackground } from '../ui/TitleBackground'
import { ScreenWrapper } from './ScreenWrapper'

interface TitleScreenProps {
  onStart: (roomId?: string) => void
  onStageSelect: () => void
  onLoad?: () => void
  onConfig: () => void
  onExit: () => void
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onStageSelect, onLoad, onConfig, onExit }) => {
  const { t } = useTranslation()
  const { engine, isGameClear } = useGame()

  const menuItems = [
    { label: t('ui.new_game'), action: () => onStart() },
    ...(onLoad ? [{ label: t('ui.load'), action: onLoad }] : []),
    ...(isGameClear ? [{ label: t('ui.stage_select'), action: onStageSelect }] : []),
    { label: t('ui.config'), action: onConfig },
    { label: t('ui.exit'), action: onExit },
  ]

  useEffect(() => {
    engine.ctx.sound.playBgm('title_theme', { loop: true, fadeIn: 2 })
  }, [])

  return (
    <>
      <TitleBackground />
      <ScreenWrapper className="relative">
        <div className="w-full h-full flex flex-col justify-center items-start pl-24 pt-10 pb-5">
          <div className="mb-8">
            <h1 className="text-4xl px-2 font-black text-white tracking-tighter animate-pulse leading-none">WRITE HOUSE</h1>
          </div>

          <GameMenuLayout engine={engine} menuItems={menuItems} className="w-48" buttonClassName="py-1.5 text-xs justify-start" />

          <div className="absolute bottom-6 left-24 text-neutral-600 text-xs">v 1.0.0</div>
        </div>
      </ScreenWrapper>
    </>
  )
}
