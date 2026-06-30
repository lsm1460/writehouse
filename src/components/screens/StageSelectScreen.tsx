import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScreenWrapper } from './ScreenWrapper'
import { assets } from '~/assets'
import { useGame } from '~/context/GameContext'
import { StageList } from '../ui/stage-select/StageList'
import { StageMapPreview } from '../ui/stage-select/StageMapPreview'
import { useGameInput } from '~/hooks/input/useGameInput'
import { useStageSelect } from '~/hooks/useStageSelect'

interface StageSelectScreenProps {
  onStart: (roomId?: string) => void
  onBack: () => void
}

type FocusTarget = 'LIST' | 'BACK'

export const StageSelectScreen: React.FC<StageSelectScreenProps> = ({ onStart, onBack }) => {
  const { t } = useTranslation()
  const { engine } = useGame()
  const [focusTarget, setFocusTarget] = useState<FocusTarget>('LIST')

  const allStages = useMemo(() => {
    return assets.map.floors.flatMap((floor) =>
      floor.rooms.map((room) => ({
        roomId: room.room_id,
        grid: room.grid,
      }))
    )
  }, [])

  const { activeIndex, setActiveIndex, listRef, currentStage } = useStageSelect({
    allStages,
  })

  useGameInput({
    engine,
    onMenuLeft: () => {
      if (focusTarget === 'BACK') setFocusTarget('LIST')
    },
    onMenuRight: () => {
      if (focusTarget === 'LIST') setFocusTarget('BACK')
    },
    onMenuUp: () => {
      if (focusTarget === 'LIST') {
        setActiveIndex((prev) => (prev - 1 + allStages.length) % allStages.length)
      }
    },
    onMenuDown: () => {
      if (focusTarget === 'LIST') {
        setActiveIndex((prev) => (prev + 1) % allStages.length)
      }
    },
    onMenuSelect: () => {
      if (focusTarget === 'LIST' && currentStage) {
        onStart(currentStage.roomId)
      } else if (focusTarget === 'BACK') {
        onBack()
      }
    },
  })

  const translateHelper = (key: string, fallback: string) => {
    return t(key) !== key ? t(key) : fallback
  }

  return (
    <ScreenWrapper className="h-screen w-full flex flex-col p-6 overflow-hidden">
      <div className="mb-6 shrink-0 w-full px-4">
        <h1 className="text-2xl font-black text-white tracking-tighter animate-pulse">{t('ui.stage_select')}</h1>
      </div>

      <div className="flex-1 grid grid-cols-[6fr_4fr] gap-5 overflow-hidden max-w-5xl w-full mx-auto pb-4">
        <div className={`w-full h-full overflow-hidden rounded-xl transition-all duration-150 ${focusTarget === 'LIST' ? '' : 'opacity-40'}`}>
          <StageList
            ref={listRef}
            floors={assets.map.floors}
            activeIndex={focusTarget === 'LIST' ? activeIndex : -1}
            onStageHover={(idx) => {
              setFocusTarget('LIST')
              setActiveIndex(idx)
            }}
            onStageSelect={onStart}
            translate={translateHelper}
          />
        </div>

        <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 flex flex-col overflow-hidden">
            {currentStage ? <StageMapPreview grid={currentStage.grid} /> : <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm">선택된 스테이지가 없습니다.</div>}
          </div>

          <div
            className={`border rounded-xl p-3 shrink-0 transition-all duration-150 ${
              focusTarget === 'BACK' ? 'bg-neutral-800 border-white shadow-lg shadow-black/40' : 'bg-neutral-900/20 border-neutral-800/60 opacity-60'
            }`}
            onMouseEnter={() => setFocusTarget('BACK')}
          >
            <button
              onClick={onBack}
              className={`w-full py-3 rounded-lg text-sm transition duration-150 font-bold tracking-wide active:scale-[0.99] ${focusTarget === 'BACK' ? 'text-white' : 'text-neutral-400'}`}
            >
              {t('ui.back')}
            </button>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  )
}
