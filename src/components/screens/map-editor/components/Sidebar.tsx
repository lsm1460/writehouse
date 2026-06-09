import { useState } from 'react'
import { useMapEditorContext } from '../context/MapEditorContext'

export function Sidebar() {
  const {
    mapData,
    selectedFloorIdx,
    setSelectedFloorIdx,
    selectedRoomIdx,
    setSelectedRoomIdx,
    currentFloor,
    currentRoom,
    handleAddFloor,
    handleRemoveFloor,
    handleAddRoom,
    handleRemoveRoom,
    resizeGrid,
    newRoomId,
    setNewRoomId,
    newRoomRows,
    setNewRoomRows,
    newRoomCols,
    setNewRoomCols,
  } = useMapEditorContext()

  // --- VS Code 스타일 사이드바 토글 상태 관리 ---
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex shrink-0 items-stretch select-none bg-neutral-950">
      
      {/* 1️⃣ VS Code의 Activity Bar 역할 (좌측 완전히 고정된 얇은 아이콘 바) */}
      <div className="w-14 bg-neutral-950 border-r border-neutral-900 flex flex-col items-center py-4 gap-4 shrink-0 z-20">
        {/* 토글 및 맵 속성 아이콘 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? "사이드바 접기" : "사이드바 열기"}
          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-all cursor-pointer group relative ${
            isOpen 
              ? 'text-blue-400 bg-neutral-900 border border-neutral-800' 
              : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <span className="text-lg">🗺️</span>
          <span className="text-[9px] font-bold tracking-tighter -mt-0.5">MAP</span>
          
          {/* 활성화 상태일 때 옆에 작게 붙는 VS Code 특유의 인디케이터 바 */}
          {isOpen && (
            <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-blue-500 rounded-r" />
          )}
        </button>
      </div>

      {/* 2️⃣ VS Code의 Side Bar 역할 (열고 닫히는 실질적 컨텐츠 영역) */}
      {isOpen && (
        <aside className="w-72 bg-neutral-950/95 border-r border-neutral-800 p-5 flex flex-col gap-6 overflow-y-auto shrink-0 animate-in slide-in-from-left duration-150">
          
          {/* 층 선택 및 관리 */}
          <section className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-1.5">
              <h2 className="text-xs font-black text-neutral-400 uppercase tracking-wider">층 (Floors)</h2>
              <button
                onClick={handleAddFloor}
                className="text-[11px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded cursor-pointer transition"
              >
                + 추가
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-1">
              {mapData.floors.map((floor, idx) => (
                <div
                  key={floor.floor_number}
                  className={`flex items-center rounded overflow-hidden text-xs font-mono font-bold border transition ${
                    selectedFloorIdx === idx
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-850 hover:bg-neutral-800'
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedFloorIdx(idx)
                      setSelectedRoomIdx(0)
                    }}
                    className="px-2.5 py-1.5 cursor-pointer"
                  >
                    {floor.floor_number}F
                  </button>
                  <button
                    onClick={() => handleRemoveFloor(idx)}
                    className="px-2 py-1.5 bg-black/10 hover:bg-red-600/60 hover:text-white text-neutral-500 border-l border-neutral-850 transition cursor-pointer"
                    title="층 삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 방 선택 및 관리 */}
          <section className="flex flex-col gap-2">
            <h2 className="text-xs font-black text-neutral-400 uppercase tracking-wider border-b border-neutral-900 pb-1.5">방 목록 (Rooms)</h2>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto border border-neutral-850 rounded bg-neutral-900/40 p-1">
              {currentFloor?.rooms.map((room, idx) => (
                <div
                  key={room.room_id}
                  className={`flex justify-between items-center px-2.5 py-1.5 rounded text-xs font-mono font-bold border transition ${
                    selectedRoomIdx === idx
                      ? 'bg-neutral-800 text-white border-neutral-700 shadow-sm'
                      : 'border-transparent text-neutral-400 hover:bg-neutral-900'
                  }`}
                >
                  <button
                    onClick={() => setSelectedRoomIdx(idx)}
                    className="flex-1 text-left cursor-pointer truncate"
                  >
                    🏠 {room.room_id}
                  </button>
                  <button
                    onClick={() => handleRemoveRoom(idx)}
                    className="text-neutral-500 hover:text-red-400 font-bold px-1 cursor-pointer transition text-sm"
                    title="방 삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* 새 방 추가 양식 */}
            <form onSubmit={handleAddRoom} className="mt-1 p-3 bg-neutral-900/60 border border-neutral-850 rounded flex flex-col gap-2.5">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">새 방 생성</div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-500 font-mono">ROOM ID</label>
                <input
                  type="text"
                  value={newRoomId}
                  onChange={(e) => setNewRoomId(e.target.value)}
                  placeholder="예: 0-3"
                  className="bg-neutral-950 border border-neutral-850 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-neutral-500 font-mono">ROWS</label>
                  <input
                    type="number"
                    min="2"
                    max="40"
                    value={newRoomRows}
                    onChange={(e) => setNewRoomRows(Number(e.target.value))}
                    className="bg-neutral-950 border border-neutral-850 rounded px-2 py-1 text-xs text-white outline-none font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-neutral-500 font-mono">COLS</label>
                  <input
                    type="number"
                    min="2"
                    max="40"
                    value={newRoomCols}
                    onChange={(e) => setNewRoomCols(Number(e.target.value))}
                    className="bg-neutral-950 border border-neutral-850 rounded px-2 py-1 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-1.5 text-xs font-bold transition mt-1 cursor-pointer shadow-sm"
              >
                + 방 추가
              </button>
            </form>
          </section>

          {/* 격자 크기 변경 버튼 */}
          {currentRoom && (
            <section className="flex flex-col gap-2 border-t border-neutral-900 pt-4 mt-auto">
              <h2 className="text-xs font-black text-neutral-400 uppercase tracking-wider">
                그리드 리사이즈 ({currentRoom.grid.length}×{currentRoom.grid[0]?.length || 0})
              </h2>
              <div className="grid grid-cols-2 gap-1.5 mt-1 text-[11px]">
                <button
                  onClick={() => resizeGrid('add_row')}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 text-neutral-300 py-1.5 rounded font-semibold transition cursor-pointer"
                >
                  + Row (행)
                </button>
                <button
                  onClick={() => resizeGrid('remove_row')}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 text-neutral-300 py-1.5 rounded font-semibold transition cursor-pointer"
                >
                  - Row (행)
                </button>
                <button
                  onClick={() => resizeGrid('add_col')}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 text-neutral-300 py-1.5 rounded font-semibold transition cursor-pointer"
                >
                  + Col (열)
                </button>
                <button
                  onClick={() => resizeGrid('remove_col')}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 text-neutral-300 py-1.5 rounded font-semibold transition cursor-pointer"
                >
                  - Col (열)
                </button>
              </div>
            </section>
          )}
        </aside>
      )}
    </div>
  )
}