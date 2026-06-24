import { useState } from 'react'
import type { GameEngine } from '~/core/gameEngine'
import { useGameInput } from '~/hooks/input/useGameInput'
import { MenuButton } from './MenuButton'
import { MenuSlider } from './MenuSlider'

export interface MenuItem {
  label: string
  action?: () => void
  value?: string | number
  type?: 'button' | 'slider'
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
}

interface GameMenuLayoutProps {
  engine: GameEngine
  menuItems: MenuItem[]
}

export function GameMenuLayout({ engine, menuItems }: GameMenuLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleAdjustSlider = (direction: 'left' | 'right') => {
    const currentItem = menuItems[activeIndex]
    if (currentItem && currentItem.type === 'slider' && currentItem.onChange) {
      const min = currentItem.min ?? 0
      const max = currentItem.max ?? 100
      const step = currentItem.step ?? 5
      const currentVal = Number(currentItem.value ?? 50)
      
      const nextVal = direction === 'left'
        ? Math.max(min, currentVal - step)
        : Math.min(max, currentVal + step)
        
      currentItem.onChange(nextVal)
    }
  }

  useGameInput({
    engine,
    onMenuUp: () => {
      setActiveIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length)
    },
    onMenuDown: () => {
      setActiveIndex((prev) => (prev + 1) % menuItems.length)
    },
    onMenuLeft: () => {
      handleAdjustSlider('left')
    },
    onMenuRight: () => {
      handleAdjustSlider('right')
    },
    onMenuSelect: () => {
      const currentItem = menuItems[activeIndex]
      if (currentItem && currentItem.type !== 'slider' && currentItem.action) {
        currentItem.action()
      }
    },
  })

  return (
    <div className="w-64 flex flex-col gap-3 items-center">
      {menuItems.map((item, index) => {
        const isSelected = index === activeIndex

        if (item.type === 'slider') {
          return (
            <MenuSlider
              key={`${item.label}-${index}`}
              label={item.label}
              value={Number(item.value ?? 0)}
              min={item.min}
              max={item.max}
              step={item.step}
              isActive={isSelected}
              onMouseEnter={() => setActiveIndex(index)}
              onChange={item.onChange ?? (() => {})}
            />
          )
        }

        return (
          <MenuButton
            key={`${item.label}-${index}`}
            onClick={item.action ?? (() => {})}
            isActive={isSelected}
            onMouseEnter={() => setActiveIndex(index)}
            value={item.value as string}
          >
            {item.label}
          </MenuButton>
        )
      })}
    </div>
  )
}