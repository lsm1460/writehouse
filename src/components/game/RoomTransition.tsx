import { useTranslation } from 'react-i18next' // 프로젝트 환경에 맞는 임포트 확인
import { FadeOverlay } from '../ui/FadeOverlay'
interface RoomTransitionProps {
  roomId: string
}

export function RoomTransition({ roomId }: RoomTransitionProps) {
  const { t } = useTranslation()

  const floorNumber = roomId.split('-')[0] || '1'

  return (
    <FadeOverlay mode="fadeInOut" delayMS={500} durationMS={1000} midDelayMS={1200}>
      <div className="text-center font-mono">
        <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          {t(`floors.title`, { floor: floorNumber })} - {t(`floors.${floorNumber}`)}
        </div>

        <div className="text-sm font-black text-amber-400 tracking-widest uppercase mt-1">ROOM {roomId}</div>

        <div className="text-2xl font-black text-white uppercase tracking-wide mt-1">{t(`rooms.${roomId}`)}</div>
      </div>
    </FadeOverlay>
  )
}
