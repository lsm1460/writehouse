import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FadeOverlay } from '../ui/FadeOverlay'

interface RoomTransitionProps {
  floorNumber: number
  roomId: string
  onTransitionEnd: () => void
}

export function RoomTransition({ floorNumber, roomId, onTransitionEnd }: RoomTransitionProps) {
  const { t } = useTranslation()
  const [currentDisplay, setCurrentDisplay] = useState({ floorNumber, roomId })

  const handleMidpoint = () => {
    setCurrentDisplay({ floorNumber, roomId })
  }

  return (
    <FadeOverlay
      mode="fadeInOut"
      delayMS={500}
      durationMS={1000}
      midDelayMS={1200}
      onMidpoint={handleMidpoint}
      onAnimationEnd={onTransitionEnd}
    >
      <div className="text-center font-mono">
        <div className="text-base font-bold text-neutral-400 uppercase tracking-tight">
          {t(`floors.title`, { floor: currentDisplay.floorNumber })} - {t(`floors.${currentDisplay.floorNumber}`)}
        </div>
        <div className="text-2xl font-black text-white uppercase tracking-wider mt-1">
          {t(`rooms.${currentDisplay.roomId}`)}
        </div>
      </div>
    </FadeOverlay>
  )
}
