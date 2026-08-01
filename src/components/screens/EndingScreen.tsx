import { useEffect, useState, useCallback } from 'react'
import { useGame } from '~/context/GameContext'
import { AlertModal } from '../ui/AlertModal'
import { useGameInput } from '~/hooks/input/useGameInput'
import { useTranslation } from 'react-i18next'

interface ConfigScreenProps {
  back: () => void
}

type Stage = 'start' | 'rise' | 'lit' | 'fade-out' | 'black' | 'light-up'

export const EndingScreen: React.FC<ConfigScreenProps> = ({ back }) => {
  const { t } = useTranslation()
  const { engine } = useGame()

  // 연출 단계: start -> rise -> lit -> fade-out -> black -> light-up
  const [stage, setStage] = useState<Stage>('start')
  const [canInteract, setCanInteract] = useState(false) // 사용자 상호작용 가능 여부
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // 1. 화면 진입 1초 후: 등대 상승 + 페이드인 시작
    const timer1 = setTimeout(() => {
      setStage('rise')
    }, 1000)

    // 2. 등대 다 올라온 후 불 켜짐 (상승 3.5초 + 대기 0.5초)
    const timer2 = setTimeout(() => {
      setStage('lit')
    }, 5000)

    // 3. 불 켜진 등대 감상 후 전체 장면 페이드아웃 시작 (4초간 여운 후)
    const timer3 = setTimeout(() => {
      setStage('fade-out')
    }, 9000)

    // 4. 페이드아웃 완료 후 완전한 암전 (페이드아웃 1.5초 + 0.5초 정적)
    const timer4 = setTimeout(() => {
      setStage('black')
    }, 11000)

    // 5. 암전 속에서 빛나는 점이 단계별 페이드인 (암전 1초 후)
    const timer5 = setTimeout(() => {
      setStage('light-up')
    }, 12000)

    // 6. 빛 점등 완료(2.5초) 후, 여운을 더 즐길 수 있도록 늦춰서 PRESS ANY KEY 활성화 (빛 연출 시작 후 5초 뒤 = 총 17초)
    const timer6 = setTimeout(() => {
      setCanInteract(true)
    }, 17000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
      clearTimeout(timer6)
    }
  }, [])

  // 사용자 상호작용 핸들러 (클릭 또는 키 입력 시 실행)
  const handleInteraction = useCallback(() => {
    if (!canInteract || isModalOpen) return
    setIsModalOpen(true)
  }, [canInteract, isModalOpen])

  const handleConfirm = () => {
    setIsModalOpen(false)
    back()
  }

  // 🎮 공용 useGameInput 훅 활용
  // engine.gameStatus가 ENDING/TITLE 등일 때 Space/Enter/패드 버튼이 onMenuSelect로 매핑됩니다.
  useGameInput({
    engine,
    onMenuSelect: isModalOpen ? handleConfirm : handleInteraction,
  })

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center text-white overflow-hidden cursor-pointer select-none" onClick={handleInteraction}>
      {/* 1 ~ 3장면: 등대 연출 영역 */}
      {stage !== 'black' && stage !== 'light-up' && (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <div
            className={`relative w-full h-full flex items-center justify-center scale-[2] origin-[65%_30%] transition-opacity duration-[1500ms] ${stage === 'fade-out' ? 'opacity-0' : 'opacity-100'}`}
            style={{
              transitionTimingFunction: stage === 'fade-out' ? 'steps(2, end)' : 'ease',
            }}
          >
            {/* 불 꺼진 등대 */}
            <img
              src="/title/before/1.png"
              alt="Lighthouse Off"
              className={`absolute w-full h-full object-cover transition-all duration-[3500ms] ${stage === 'start' ? 'opacity-0' : 'opacity-100'}`}
              style={{
                transform: stage === 'start' ? 'translateY(80%)' : 'translateY(0%)',
                transitionTimingFunction: 'steps(4, end)',
              }}
            />

            {/* 불 켜진 등대 */}
            <img
              src="/title/after/1.png"
              alt="Lighthouse On"
              className={`absolute w-full h-full object-cover transition-opacity duration-[2000ms] ${stage === 'lit' || stage === 'fade-out' ? 'opacity-100' : 'opacity-0'}`}
              style={{
                transitionTimingFunction: 'steps(3, end)',
              }}
            />
          </div>
        </div>
      )}

      {/* 4장면: 검은 배경 + 단계별 페이드인 빛나는 점 & 입력 프롬프트 */}
      {(stage === 'black' || stage === 'light-up') && (
        <div className="relative w-full h-full bg-black flex flex-col items-center justify-center">
          <div
            className={`w-4 h-4 bg-white rounded-none transition-all duration-[2500ms] ${
              stage === 'light-up' ? 'opacity-100 scale-150 shadow-[0_0_80px_30px_rgba(255,255,255,0.9)]' : 'opacity-0 scale-50 shadow-none'
            }`}
            style={{
              transitionTimingFunction: 'steps(3, end)',
            }}
          />

          {/* 빛 연출 완료 후 여운을 두고 천천히 나타나는 레트로 프롬프트 */}
          <div
            className={`absolute bottom-20 font-mono text-sm tracking-widest text-neutral-400 transition-opacity duration-1000 ${
              canInteract && !isModalOpen ? 'opacity-100 animate-pulse' : 'opacity-0'
            }`}
          >
            [ PRESS ANY KEY ]
          </div>
        </div>
      )}

      {/* 최종 안내 모달 */}
      <AlertModal isOpen={isModalOpen} message={t('ui.modal.backToTitle')} confirmLabel={t('ui.modal.confirm')} onConfirm={handleConfirm} />
    </div>
  )
}
