import { memo } from 'react'

interface TooltipProps {
  label: string
  example?: string
}

export const Tooltip = memo(function Tooltip({ label, example }: TooltipProps) {
  return (
    <div className="opacity-40 hover:opacity-100 absolute top-1 right-1 translate-x-full -translate-y-full w-max max-w-[180px] bg-neutral-950/75 border border-emerald-500 backdrop-blur-[2px] px-1 pt-0.5 rounded-sm z-50 font-mono text-left">
      <div className="text-[11px] font-bold text-emerald-400 tracking-wide truncate">{label}</div>

      {example && (
        <div className="text-[9px] leading-tight text-neutral-400 mt-0.5 whitespace-pre-wrap break-words">
          <span className="text-emerald-600/90 font-bold mr-0.5">ex)</span>
          {example}
        </div>
      )}

      <svg
        className="absolute -bottom-2 right-full w-1 h-2 text-emerald-500 pointer-events-none"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="12" y1="0" x2="0" y2="12" />
      </svg>
    </div>
  )
})
