import React, { useState } from 'react'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'
import { useGameInput } from '~/hooks/input/useGameInput'
import { useGame } from '~/context/GameContext'
import { MenuButton } from '../ui/MenuButton'
import { useTranslation } from 'react-i18next'

interface ConfigScreenProps {
  backToTitle: () => void
}

type MenuState = 'MAIN' | 'LANG'

interface MenuItem {
  id: string
  label: string
  payload?: string
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ backToTitle }) => {
  const { t, i18n } = useTranslation()
  const { isReady, scale } = useWindowScale()
  const { engine, currentRoomId, save } = useGame()

  const [currentMenu, setCurrentMenu] = useState<MenuState>('MAIN')
  const [activeIndex, setActiveIndex] = useState(0)

  const currentLanguage = i18n.language.startsWith('ko') ? 'ko' : 'en'

  const menuConfig: Record<MenuState, MenuItem[]> = {
    MAIN: [
      { id: 'GO_LANG', label: t('ui.lang') },
      { id: 'BACK_TO_TITLE', label: t('ui.back') },
    ],
    LANG: [
      { id: 'SET_LANG', label: '한국어', payload: 'ko' },
      { id: 'SET_LANG', label: 'English', payload: 'en' },
      { id: 'BACK_TO_MAIN', label: t('ui.back') },
    ],
  }

  const currentItems = menuConfig[currentMenu]

  const handleMenuSelect = (item: MenuItem) => {
    switch (item.id) {
      case 'GO_LANG':
        setCurrentMenu('LANG')
        setActiveIndex(0)
        break
      case 'BACK_TO_TITLE':
        backToTitle()
        break
      case 'SET_LANG':
        if (item.payload) {
          i18n.changeLanguage(item.payload)
          save.save(currentRoomId, item.payload)
        }
        setCurrentMenu('MAIN')
        setActiveIndex(0)
        break
      case 'BACK_TO_MAIN':
        setCurrentMenu('MAIN')
        setActiveIndex(0)
        break
    }
  }

  useGameInput({
    engine,
    onMenuUp: () => {
      setActiveIndex((prev) => (prev - 1 + currentItems.length) % currentItems.length)
    },
    onMenuDown: () => {
      setActiveIndex((prev) => (prev + 1) % currentItems.length)
    },
    onMenuSelect: () => {
      if (currentItems[activeIndex]) {
        handleMenuSelect(currentItems[activeIndex])
      }
    },
  })

  if (!isReady) return <></>

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-900 z-50">
      <div
        className="flex flex-col items-center justify-center py-5"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '1024px',
          height: '576px',
        }}
      >
        <div className="flex flex-col gap-3 w-64">
          {currentItems.map((item, index) => {
            const isSelectedLang = currentMenu === 'LANG' && item.payload === currentLanguage

            return (
              <MenuButton
                key={`${item.id}-${index}`}
                onClick={() => handleMenuSelect(item)}
                isActive={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                textClassName={`text-xl w-full ${isSelectedLang ? 'text-amber-400 font-bold' : ''}`}
              >
                {item.label}
              </MenuButton>
            )
          })}
        </div>
      </div>
    </div>
  )
}
