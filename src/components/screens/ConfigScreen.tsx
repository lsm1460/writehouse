import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '~/context/GameContext'
import { GameMenuLayout, type MenuItem } from '../ui/GameMenuLayout'
import { ScreenWrapper } from './ScreenWrapper'

interface ConfigScreenProps {
  back: () => void
}

type MenuState = 'MAIN' | 'LANG' | 'SOUND'

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ back }) => {
  const { t, i18n } = useTranslation()
  const { engine } = useGame()

  const [currentMenu, setCurrentMenu] = useState<MenuState>('MAIN')
  const [tooltipEnabled, setTooltipEnabled] = useState<boolean>(() => engine.ctx.tooltipEnabled !== false)
  const [isMute, setIsMute] = useState<boolean>(() => engine.ctx.sound.getMute())

  const [bgmVolume, setBgmVolume] = useState<number>(() => engine.ctx.config.bgmVolume * 100)
  const [ambientVolume, setAmbientVolume] = useState<number>(() => engine.ctx.config.ambientVolume * 100)
  const [sfxVolume, setSfxVolume] = useState<number>(() => engine.ctx.config.sfxVolume * 100)

  const debounceTimers = useRef<Record<string, number>>({})

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout)
    }
  }, [])

  const setEngineVolumeDebounced = (type: 'bgm' | 'ambient' | 'sfx', value: number) => {
    if (debounceTimers.current[type]) {
      clearTimeout(debounceTimers.current[type])
    }

    debounceTimers.current[type] = setTimeout(() => {
      const normalizedValue = value / 100
      if (type === 'bgm') engine.ctx.config.setBgmVolume(normalizedValue)
      if (type === 'ambient') engine.ctx.config.setAmbientVolume(normalizedValue)
      if (type === 'sfx') engine.ctx.config.setSfxVolume(normalizedValue)
    }, 300)
  }

  const currentLanguage = i18n.language.startsWith('ko') ? 'ko' : 'en'
  const langLabel = currentLanguage === 'ko' ? 'Ko' : 'En'

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang)
    engine.ctx.config.setLang(lang)
    setCurrentMenu('MAIN')
  }

  const toggleTooltip = () => {
    const nextValue = !tooltipEnabled
    setTooltipEnabled(nextValue)
    engine.ctx.config.setTooltipEnabled(nextValue)
  }

  const toggleMute = () => {
    const nextValue = !isMute
    setIsMute(nextValue)
    engine.ctx.config.setIsMuted(nextValue)
  }

  const menuConfig: Record<MenuState, MenuItem[]> = {
    MAIN: [
      { label: t('ui.lang'), value: langLabel, action: () => setCurrentMenu('LANG') },
      { label: t('ui.sound') || 'Sound Settings', action: () => setCurrentMenu('SOUND') }, // 사운드 메뉴 진입
      { label: t('ui.tooltip'), value: tooltipEnabled ? t('ui.on') : t('ui.off'), action: toggleTooltip },
      { label: t('ui.back'), action: () => back() },
    ],
    SOUND: [
      { label: t('ui.mute'), value: isMute ? t('ui.on') : t('ui.off'), action: toggleMute },
      {
        label: t('ui.bgm'),
        type: 'slider',
        value: bgmVolume,
        onChange: (val) => {
          setBgmVolume(val) // UI는 즉시 갱신
          setEngineVolumeDebounced('bgm', val) // 엔진 설정은 디바운스
        },
      },
      // {
      //   label: t('ui.ambient'),
      //   type: 'slider',
      //   value: ambientVolume,
      //   onChange: (val) => {
      //     setAmbientVolume(val)
      //     setEngineVolumeDebounced('ambient', val)
      //   },
      // },
      {
        label: t('ui.sfx'),
        type: 'slider',
        value: sfxVolume,
        onChange: (val) => {
          setSfxVolume(val)
          setEngineVolumeDebounced('sfx', val)
        },
      },
      { label: t('ui.back'), action: () => setCurrentMenu('MAIN') },
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
