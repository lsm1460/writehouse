import React, { useState } from 'react'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'
import { useGameInput } from '~/hooks/input/useGameInput' // ✨ 인풋 훅 임포트
import { useGame } from '~/context/GameContext' // ✨ 엔진을 가져오기 위한 컨텍스트 (예시)
import { MenuButton } from '../ui/MenuButton'

interface TitleScreenProps {
  onStart: () => void
  onLoad?: () => void
  onExit: () => void
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onLoad, onExit }) => {
  const { scale } = useWindowScale()
  const { engine } = useGame()

  const menuItems = [
    { label: 'New Game', action: onStart },
    ...(onLoad ? [{ label: 'Load', action: onLoad }] : []),
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-900 z-50">
      <div
        className="flex flex-col items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '1024px',
          height: '576px',
        }}
      >
        <div className="mb-12 text-center">
          <h1 className="text-8xl font-black text-white tracking-tighter mb-4 animate-pulse">
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
              textClassName="text-2xl w-full"
            >
              {item.label}
            </MenuButton>
          ))}
        </div>

        <div className="absolute bottom-8 text-neutral-600 font-mono text-xs">
          © 2026 WriteHouse Studio. All rights reserved.
        </div>
      </div>
    </div>
  )
}