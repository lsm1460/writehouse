import React, { useState } from 'react'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'
import { useGameInput } from '~/hooks/input/useGameInput'
import { useGame } from '~/context/GameContext'
import { MenuButton } from '../ui/MenuButton'
import { useTranslation } from 'react-i18next'

interface TitleScreenProps {
  onStart: () => void
  onLoad?: () => void
  onConfig: () => void
  onExit: () => void
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onLoad, onConfig, onExit }) => {
  const { t } = useTranslation()
  const { isReady, scale } = useWindowScale()
  const { engine } = useGame()

  const menuItems = [
    { label: t('ui.new_game'), action: onStart },
    ...(onLoad ? [{ label: t('ui.load'), action: onLoad }] : []),
    { label: t('ui.config'), action: onConfig },
    { label: 'Exit', action: onExit },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  useGameInput({
    engine,
    onMenuUp: () => {
      setActiveIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length)
    },
    onMenuDown: () => {
      setActiveIndex((prev) => (prev + 1) % menuItems.length)
    },
    onMenuSelect: () => {
      if (menuItems[activeIndex]) {
        menuItems[activeIndex].action()
      }
    },
  })

  if (!isReady) return <></>

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-900 z-50">
      <div
        className="flex flex-col items-center justify-center pt-10 pb-5"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '1024px',
          height: '576px',
        }}
      >
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-black text-white tracking-tighter animate-pulse">
            WRITE<br />HOUSE
          </h1>
        </div>

        <div className="flex flex-col gap-3 w-64">
          {menuItems.map((item, index) => (
            <MenuButton
              key={item.label}
              onClick={item.action}
              isActive={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              textClassName="text-xl w-full"
            >
              {item.label}
            </MenuButton>
          ))}
        </div>

        <div className="mt-10 pb-4 text-neutral-600 font-mono text-xs">
          © 2026 WriteHouse Studio. All rights reserved.
        </div>
      </div>
    </div>
  )
}