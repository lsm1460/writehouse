import { useState } from 'react'
import { useGame } from '~/context/GameContext'
import { useGameInput } from '~/hooks/input/useGameInput'
import { FadeOverlay } from '../ui/FadeOverlay'
import { MenuButton } from '../ui/MenuButton'

interface MenuProps {
  onResume: () => void
  onRestart: () => void
  onExit: () => void
}

export function GameMenu({ onResume, onRestart, onExit }: MenuProps) {
  const { engine } = useGame()

  const menuItems = [
    { label: 'Resume', action: onResume },
    { label: 'Retry', action: onRestart },
    { label: 'Back to Title', action: onExit },
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
    <FadeOverlay delayMS={0} durationMS={0}>
      <div className="flex flex-col gap-4 w-64">
        <h2 className="text-3xl text-center text-neutral-400 font-bold mb-4 uppercase tracking-tighter">Pause</h2>
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
    </FadeOverlay>
  )
}
