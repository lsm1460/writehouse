import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '~/context/GameContext'

export function Tutorial() {
  const { t } = useTranslation()
  const { currentRoomId, player } = useGame()

  const [activeText, setActiveText] = useState('')
  const prevRoomIdRef = useRef(currentRoomId)

  useEffect(() => {
    // 1. 방 ID가 실제로 변경되었는지 확인
    const isRoomChanged = prevRoomIdRef.current !== currentRoomId

    if (isRoomChanged && (player.pos.x !== 0 || player.pos.y !== 0)) {
      return
    }

    prevRoomIdRef.current = currentRoomId

    const translationKey = `tutorial.${currentRoomId}.${player.pos.x}_${player.pos.y}`
    setActiveText(t(translationKey, { defaultValue: '' }))
  }, [currentRoomId, player.pos.x, player.pos.y, t])

  if (!activeText) return null

  return (
    <div className="fixed top-1/4 left-1/2 -translate-x-1/2 whitespace-pre text-center font-mono text-sm font-medium text-neutral-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide select-none z-30 animate-fade-in animate-pulse">
      {activeText}
    </div>
  )
}
