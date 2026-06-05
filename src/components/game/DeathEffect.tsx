interface DeathEffectProps {
  reason: 'FIRE' | 'ELECTRICITY'
}

export function DeathEffect({ reason }: DeathEffectProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none font-bold text-lg death-effect-anim">
      <span className="text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]">*</span>
    </div>
  )
}
