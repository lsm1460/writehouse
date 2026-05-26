interface MenuButtonProps {
  onClick: () => void
  children: React.ReactNode
  isActive?: boolean
  onMouseEnter?: () => void
  className?: string
  textClassName?: string
}

export function MenuButton({
  onClick,
  children,
  isActive = false,
  onMouseEnter,
  className = '',
  textClassName = '',
}: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`w-full px-12 py-2 transition-all duration-200 rounded-sm font-bold text-neutral-400 border cursor-pointer
        ${
          isActive
            ? 'border-white'
            : 'bg-transparent border-transparent'
        } 
        ${className}`}
    >
      <span className={textClassName}>{children}</span>
    </button>
  )
}