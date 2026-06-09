import { useState, useEffect, useRef } from 'react'
import { PALETTE_TILES } from '../constants'
import { useMapEditorContext } from '../context/MapEditorContext'

export function GridEditor() {
  const { currentRoom, handleCellClick } = useMapEditorContext()

  // --- 마우스 드래그 타일 배치 상태 ---
  const [isDrawing, setIsDrawing] = useState(false)

  // --- 💡 줌(Zoom) & 팬(Pan) 상태 관리 ---
  const [scale, setScale] = useState(1) // 확대 배율 (1 = 100%)
  const [pan, setPan] = useState({ x: 0, y: 0 }) // 화면 이동 좌표
  const [isPanning, setIsPanning] = useState(false) // 휠 버튼 드래그 중 여부
  
  const viewportRef = useRef<HTMLDivElement>(null)
  const panStart = useRef({ x: 0, y: 0 })

  // 줌 조절 함수 (최소 0.5배 ~ 최대 3배 제한)
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5))
  const handleZoomReset = () => { setScale(1); setPan({ x: 0, y: 0 }); }

  // 글로벌 마우스 업 이벤트 처리 (그리기 및 화면 이동 해제)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDrawing(false)
      if (isPanning) {
        setIsPanning(false)
        document.body.style.cursor = 'default'
      }
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [isPanning])

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
        선택된 방이 없습니다. 왼쪽 사이드바에서 방을 추가하거나 선택해 주세요.
      </div>
    )
  }

  // --- 휠 버튼 드래그(Pan) 핸들러 ---
  const handleMouseDown = (e: React.MouseEvent) => {
    // e.button === 1 이 마우스 휠(미들) 버튼입니다.
    if (e.button === 1) {
      e.preventDefault()
      setIsPanning(true)
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
      document.body.style.cursor = 'grabbing'
      return
    }

    // 마우스 왼쪽 버튼 클릭 시 그리기 모드 활성화
    if (e.button === 0 && !isPanning) {
      setIsDrawing(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    // 휠 드래그 중일 때 화면 위치 이동 계산
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y
      })
    }
  }

  return (
    <div 
      ref={viewportRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg relative overflow-hidden select-none cursor-crosshair"
      style={{ cursor: isPanning ? 'grabbing' : 'crosshair' }}
    >
      {/* 💡 무한 변형 가상 캔버스 래퍼 (줌과 팬 좌표가 여기에 실시간 주입됨) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.05s ease-out'
        }}
      >
        <div 
          className="flex flex-col border border-neutral-800 shadow-2xl pointer-events-auto bg-neutral-900"
          onMouseLeave={() => setIsDrawing(false)}
        >
          {currentRoom.grid.map((row, rIdx) => (
            <div key={rIdx} className="flex">
              {row.map((cell, cIdx) => {
                const paletteInfo = PALETTE_TILES.find((t) => t.char === cell) || {
                  bg: 'bg-neutral-800 text-neutral-500 border-neutral-750',
                }
                return (
                  <div
                    key={cIdx}
                    onMouseDown={(e) => {
                      if (e.button === 0 && !isPanning) {
                        setIsDrawing(true)
                        handleCellClick(rIdx, cIdx)
                      }
                    }}
                    onMouseEnter={() => {
                      if (isDrawing && !isPanning) {
                        handleCellClick(rIdx, cIdx)
                      }
                    }}
                    className={`w-10 h-10 border flex items-center justify-center text-sm font-mono transition-colors select-none shrink-0 ${paletteInfo.bg}`}
                    title={`Row: ${rIdx}, Col: ${cIdx} [${cell || '빈값'}]`}
                  >
                    {cell || ' '}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 🔍 하단 플로팅 줌 컨트롤 컨트롤러 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 flex items-center gap-2 shadow-2xl font-mono z-30">
        <button
          onClick={handleZoomOut}
          title="축소"
          className="w-6 h-6 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-bold cursor-pointer transition text-xs"
        >
          -
        </button>
        <button
          onClick={handleZoomReset}
          title="원래 크기로 (좌표 초기화)"
          className="text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition cursor-pointer"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          title="확대"
          className="w-6 h-6 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-bold cursor-pointer transition text-xs"
        >
          +
        </button>
        
        <div className="text-[10px] text-neutral-500 ml-2 border-l border-neutral-800 pl-2 hidden sm:inline">
          🖱️ 휠 버튼 드래그로 화면 이동
        </div>
      </div>
    </div>
  )
}