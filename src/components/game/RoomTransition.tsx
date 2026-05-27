import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FadeOverlay } from '../ui/FadeOverlay'

interface RoomTransitionProps {
  floorNumber: number
  roomId: string
  onTransitionEnd: () => void // 애니메이션이 끝나면 부모에게 알림
}

export function RoomTransition({ floorNumber, roomId, onTransitionEnd }: RoomTransitionProps) {
  const { t } = useTranslation()
  const [currentDisplay, setCurrentDisplay] = useState({ floorNumber, roomId })

  useEffect(() => {
    setCurrentDisplay({ floorNumber, roomId })
  }, [roomId, floorNumber])

  return (
    <FadeOverlay in={false} delayMS={1000} durationMS={500} onAnimationEnd={onTransitionEnd}>
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