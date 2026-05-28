interface MenuButtonProps {
  onClick: () => void
  children: React.ReactNode
  isActive?: boolean
  onMouseEnter?: () => void
  className?: string
  value?: string
}

export function MenuButton({ onClick, children, isActive = false, onMouseEnter, className = '', value }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`w-full px-4 py-2 transition-all duration-200 rounded-sm font-bold border cursor-pointer flex justify-center items-center gap-2
        ${isActive ? 'border-white text-white' : 'bg-transparent border-transparent text-neutral-400'} 
        ${className}`}
    >
      <span>{children}</span>
      {value && <span className={`text-sm ${isActive ? 'text-amber-400' : 'text-neutral-500'}`}>{value}</span>}
    </button>
  )
}