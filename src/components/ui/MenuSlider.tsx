import React from 'react'

interface MenuSliderProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  isActive: boolean
  onMouseEnter: () => void
  onChange: (value: number) => void
}

export const MenuSlider: React.FC<MenuSliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 5,
  isActive,
  onMouseEnter,
  onChange,
}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className={`w-full px-4 py-2 transition-all duration-200 rounded-sm font-bold border flex flex-col gap-2
        ${isActive ? 'border-white text-white' : 'bg-transparent border-transparent text-neutral-400'}`}
    >
      <div className="flex justify-between items-center w-full">
        <span>{label}</span>
        <span className={`text-sm ${isActive ? 'text-amber-400' : 'text-neutral-500'}`}>{value}%</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-1.5 bg-neutral-800 rounded-sm appearance-none cursor-pointer focus:outline-none transition-all duration-200
          ${isActive ? 'accent-amber-400' : 'accent-neutral-600'}`}
      />
    </div>
  )
}
