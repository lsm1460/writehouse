import { useState } from 'react'
import { useGameInput } from '~/hooks/input/useGameInput'
import { MenuButton } from './MenuButton'

interface MenuItem {
  label: string
  action: () => void
  value?: string
}

interface GameMenuLayoutProps {
  engine: any
  menuItems: MenuItem[]
}

export function GameMenuLayout({ engine, menuItems }: GameMenuLayoutProps) {
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
    <div className="w-64 flex flex-col gap-3 items-center">
      {menuItems.map((item, index) => (
        <MenuButton
          key={`${item.label}-${index}`}
          onClick={item.action}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
          value={item.value}
        >
          {item.label}
        </MenuButton>
      ))}
    </div>
  )
}