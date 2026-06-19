import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '~/context/GameContext'
import { GameMenuLayout } from '../ui/GameMenuLayout'
import { ScreenWrapper } from './ScreenWrapper'

interface ConfigScreenProps {
  backToTitle: () => void
}

type MenuState = 'MAIN' | 'LANG'

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ backToTitle }) => {
  const { t, i18n } = useTranslation()
  const { engine } = useGame()

  const [currentMenu, setCurrentMenu] = useState<MenuState>('MAIN')
  const [tooltipEnabled, setTooltipEnabled] = useState<boolean>(() => {
    return engine.ctx.tooltipEnabled !== false
  })

  const currentLanguage = i18n.language.startsWith('ko') ? 'ko' : 'en'
  const langLabel = currentLanguage === 'ko' ? 'Ko' : 'En'

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang)
    engine.ctx.setLang(lang)
    setCurrentMenu('MAIN')
  }

  const toggleTooltip = () => {
    const nextValue = !tooltipEnabled
    setTooltipEnabled(nextValue)
    engine.ctx.setTooltipEnabled(nextValue)
  }

  const menuConfig = {
    MAIN: [
      { label: t('ui.lang'), value: langLabel, action: () => setCurrentMenu('LANG') },
      { label: t('ui.tooltip'), value: tooltipEnabled ? t('ui.on') : t('ui.off'), action: toggleTooltip },
      { label: t('ui.back'), action: () => backToTitle() },
    ],
    LANG: [
      { label: '한국어', value: currentLanguage === 'ko' ? '✓' : undefined, action: () => changeLang('ko') },
      { label: 'English', value: currentLanguage === 'en' ? '✓' : undefined, action: () => changeLang('en') },
      { label: t('ui.back'), action: () => setCurrentMenu('MAIN') },
    ],
  }

  return (
    <ScreenWrapper className="py-5">
      <GameMenuLayout key={currentMenu} engine={engine} menuItems={menuConfig[currentMenu]} />
    </ScreenWrapper>
  )
}
