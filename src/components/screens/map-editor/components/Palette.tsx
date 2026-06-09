import { useState, useRef, useEffect } from 'react'
import { PALETTE_TILES } from '../constants'
import { useMapEditorContext } from '../context/MapEditorContext'

export function Palette() {
  const { selectedTileChar, setSelectedTileChar } = useMapEditorContext()
  const [hoveredTileLabel, setHoveredTileLabel] = useState<string | null>(null)
  const currentSelectedTile = PALETTE_TILES.find(t => t.char === selectedTileChar)

  // --- 리사이즈 및 토글 상태 관리 ---
  const [isOpen, setIsOpen] = useState(true)
  const [width, setWidth] = useState(288) // 기본 w-72 = 288px
  const isResizing = useRef(false)

  // 드래그 시작
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  // 드래그 이벤트 처리
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return
      const newWidth = window.innerWidth - e.clientX - 24
      if (newWidth > 200 && newWidth < 500) {
        setWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false
        document.body.style.cursor = 'default'
        document.body.style.userSelect = 'auto'
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // 1️⃣ [접혔을 때] 오른쪽 구석 플로팅 버튼 UI
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="팔레트 열기"
        className="fixed bottom-6 right-6 w-14 h-14 bg-neutral-950 border border-neutral-700 hover:border-blue-500 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 cursor-pointer z-50 group"
      >
        {/* 현재 선택된 타일 프리뷰 (버튼 내부 중심에 배치) */}
        {currentSelectedTile ? (
          <div className={`w-8 h-8 flex items-center justify-center font-mono text-xs border rounded shadow-inner ${currentSelectedTile.bg}`}>
            {currentSelectedTile.char}
          </div>
        ) : (
          <span className="text-neutral-400 font-mono text-sm">P</span>
        )}

        {/* 호버 시 슬며시 나타나는 미니 뱃지 아이콘 */}
        <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center text-white font-bold opacity-80 group-hover:opacity-100 border border-neutral-950">
          🎨
        </span>
      </button>
    )
  }

  // 2️⃣ [열렸을 때] 우측 패널 UI
  return (
    <div 
      style={{ width: `${width}px` }}
      className="bg-neutral-950 border border-neutral-800 rounded-lg flex shrink-0 relative overflow-hidden shadow-xl"
    >
      {/* 순수 리사이즈 핸들 (오직 드래그만 인식, 버튼 없음) */}
      <div 
        onMouseDown={startResize}
        className="w-1.5 bg-transparent hover:bg-blue-500/40 cursor-ew-resize h-full absolute left-0 top-0 z-20 transition-colors"
        title="드래그하여 크기 조절"
      />

      {/* 컨텐츠 영역 */}
      <div className="flex-1 p-4 pl-5 flex flex-col gap-4 overflow-hidden h-full">
        
        {/* 헤더 */}
        <div className="flex justify-between items-center border-b border-neutral-900 pb-2 select-none shrink-0">
          <div className="flex items-center gap-2 truncate">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider truncate">
              타일 팔레트
            </h3>
            <span className="text-[10px] bg-neutral-900 border border-neutral-850 px-1.5 py-0.5 rounded text-neutral-500 font-mono">
              {PALETTE_TILES.length}
            </span>
          </div>
          
          {/* 접기 버튼 (클릭 시 플로팅 버튼으로 전환됨) */}
          <button
            onClick={() => setIsOpen(false)}
            title="팔레트 접기 (플로팅 버튼으로 변경)"
            className="w-5 h-5 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 hover:border-neutral-700 rounded text-[10px] text-neutral-400 hover:text-white cursor-pointer transition"
          >
            ▶
          </button>
        </div>

        {/* 타일 그리드 영역 */}
        <div className="flex-1 overflow-y-auto pr-1 pt-1">
          <div className="grid gap-2 justify-items-center [grid-template-columns:repeat(auto-fill,minmax(42px,1fr))]">
            {PALETTE_TILES.map((tile) => {
              const isSelected = selectedTileChar === tile.char
              return (
                <button
                  key={tile.char}
                  onClick={() => setSelectedTileChar(tile.char)}
                  onMouseEnter={() => setHoveredTileLabel(tile.label)}
                  onMouseLeave={() => setHoveredTileLabel(null)}
                  title={tile.label}
                  className={`w-10 h-10 flex items-center justify-center font-mono text-sm rounded border transition-all cursor-pointer relative ${tile.bg} ${
                    isSelected
                      ? 'ring-2 ring-blue-500 border-white text-white font-bold scale-105 z-10 shadow-md'
                      : 'border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:scale-105'
                  }`}
                >
                  {tile.char}
                </button>
              )
            })}
          </div>
        </div>

        {/* 하단 인포바 */}
        <div className="bg-neutral-900 border border-neutral-850 rounded p-2.5 min-h-[60px] flex flex-col justify-center text-xs font-mono shrink-0 select-none">
          {hoveredTileLabel ? (
            <div className="text-neutral-300 truncate">
              <span className="text-blue-400 mr-1">🔍 INFO:</span> {hoveredTileLabel}
            </div>
          ) : currentSelectedTile ? (
            <div className="truncate">
              <div className="text-neutral-500 text-[9px] uppercase tracking-wider mb-0.5">Selected</div>
              <div className="text-white font-bold flex items-center gap-2 truncate">
                <span className={`inline-block w-4 h-4 text-center leading-4 border text-[10px] rounded shrink-0 ${currentSelectedTile.bg}`}>
                  {currentSelectedTile.char}
                </span>
                <span className="truncate text-neutral-200">{currentSelectedTile.label}</span>
              </div>
            </div>
          ) : (
            <div className="text-neutral-600 text-center text-[11px] italic">Hover tile to view details</div>
          )}
        </div>
      </div>
    </div>
  )
}