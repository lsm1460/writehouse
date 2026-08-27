import { useTranslation } from 'react-i18next'
import { useGame } from '~/context/GameContext'
import { useWindowScale } from '~/hooks/input/ui/useWindowScale'
import { useGamepadActive } from '~/hooks/input/useGameInput'

// === 컨트롤러 전용 위치기반 SVG 아이콘 컴포넌트들 ===

// D-Pad (십자키)
function DPadIcon() {
  return (
    <svg className="inline-block w-4 h-4 fill-current align-sub mr-0.5" viewBox="0 0 24 24">
      <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2zm2 2v6H4v2h7v6h2v-6h7v-2h-7V4h-2z" />
    </svg>
  )
}

// 4개 버튼 중 [아래쪽] 버튼 강조 (South / A / ✕)
function SouthButtonIcon() {
  return (
    <svg className="inline-block w-4 h-4 fill-current align-sub mr-0.5" viewBox="0 0 24 24">
      {/* 위쪽 원 (빈 원) */}
      <circle cx="12" cy="5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* 왼쪽 원 (빈 원) */}
      <circle cx="5" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* 오른쪽 원 (빈 원) */}
      <circle cx="19" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* 아래쪽 원 (칠해진 원) */}
      <circle cx="12" cy="19" r="3" fill="currentColor" />
    </svg>
  )
}

// 4개 버튼 중 [오른쪽] 버튼 강조 (East / B / ◯)
function EastButtonIcon() {
  return (
    <svg className="inline-block w-4 h-4 fill-current align-sub mr-0.5" viewBox="0 0 24 24">
      {/* 위쪽 원 (빈 원) */}
      <circle cx="12" cy="5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* 왼쪽 원 (빈 원) */}
      <circle cx="5" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* 아래쪽 원 (빈 원) */}
      <circle cx="12" cy="19" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* 오른쪽 원 (칠해진 원) */}
      <circle cx="19" cy="12" r="3" fill="currentColor" />
    </svg>
  )
}

// 메뉴 / Start / Options 버튼 (햄버거 메뉴)
function MenuButtonIcon() {
  return (
    <svg className="inline-block w-4 h-4 fill-current align-sub mr-0.5" viewBox="0 0 24 24">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  )
}

export function GameUi() {
  const { t } = useTranslation()
  const { player, turn } = useGame()
  const { isReady, scale } = useWindowScale()
  const isGamepadActive = useGamepadActive()

  if (!isReady) return null

  return (
    <div
      className="fixed bottom-0 left-1/2 pb-5 w-full -translate-x-1/2 flex flex-col gap-2 pointer-events-none select-none"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center bottom',
      }}
    >
      {/* <QuickSlots inventorySystem={inventory} /> */}

      <p className="flex items-center justify-center gap-x-3 text-xs text-neutral-500 font-mono">
        <span>
          ({player.pos.x}.{player.pos.y})
        </span>
        <span>|</span>
        <span>{t('ui.turn', { count: turn })}</span>
      </p>

      <div className="w-full text-center text-xs text-neutral-400 flex items-center justify-center gap-x-2 flex-wrap">
        {isGamepadActive ? (
          <div className="flex items-center gap-x-3">
            <span className="inline-flex items-center gap-x-1">
              <DPadIcon /> {t('ui.move')}
            </span>
            <span>|</span>
            <span className="inline-flex items-center gap-x-1">
              <SouthButtonIcon />
              <EastButtonIcon /> {t('ui.undo')}
            </span>
            <span>|</span>
            <span className="inline-flex items-center gap-x-1">
              <MenuButtonIcon /> {t('ui.menu')}
            </span>
          </div>
        ) : (
          <div>
            [WASD / Arrows]: {t('ui.move')} | [Space]: {t('ui.undo')} | [R]: {t('ui.retry')} | [ESC]: {t('ui.menu')}
          </div>
        )}
      </div>
    </div>
  )
}
