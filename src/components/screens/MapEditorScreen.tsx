import { useState } from 'react'
import { assets } from '~/assets'
import { GameEngine, type MapData } from '~/core/gameEngine'
import { GameProvider } from '~/context/GameContext'
import { GameScreen } from './GameScreen'

// 지원하는 타일 종류 정의
const PALETTE_TILES = [
  { char: ' ', label: '빈 바닥 (Floor)', bg: 'bg-neutral-800 border-neutral-700' },
  { char: '#', label: '벽', bg: 'bg-stone-600 border-stone-500 text-stone-200 font-bold' },
  { char: 'S', label: '시작점 (Start)', bg: 'bg-blue-900 border-blue-700 text-blue-200 font-black' },
  { char: 'G', label: '문', bg: 'bg-green-900 border-green-700 text-green-200 font-black' },
  { char: '_', label: '합성의 토대', bg: 'bg-yellow-900 border-yellow-700 text-yellow-200 font-bold' },
  { char: 'i', label: '빛 수신기', bg: 'bg-amber-800 border-amber-600 text-amber-200' },
  { char: 'I', label: '나무 막대기', bg: 'bg-orange-900 border-orange-700 text-orange-200' },
  { char: 'g', label: '풀', bg: 'bg-emerald-900 border-emerald-700 text-emerald-300' },
  { char: 'T', label: '나무', bg: 'bg-lime-950 border-lime-850 text-lime-400' },
  { char: 'F', label: '맹렬한 불길', bg: 'bg-red-950 border-red-850 text-red-400 font-bold animate-pulse' },
  { char: 'w', label: '얕은 물', bg: 'bg-cyan-950 border-cyan-850 text-cyan-400' },
  { char: 'W', label: '깊은 물', bg: 'bg-cyan-950 border-cyan-850 text-cyan-400' },
  { char: 'E', label: '1차 전지', bg: 'bg-rose-950 border-rose-850 text-rose-300 font-bold' },
  { char: '1', label: '전선', bg: 'bg-purple-950 border-purple-850 text-purple-300 font-bold' },
  { char: '8', label: '지속 가능한 에너지', bg: 'bg-violet-950 border-violet-850 text-violet-300 font-bold' },
  { char: 'O', label: '기름', bg: 'bg-yellow-950 border-yellow-850 text-yellow-500' },
  { char: 'M', label: '좌우', bg: 'bg-red-900 border-red-700 text-red-200 font-bold' },
  { char: 'm', label: '상하', bg: 'bg-red-950 border-red-800 text-red-300' },
  { char: '=', label: '부싯돌', bg: 'bg-amber-950 border-amber-900 text-amber-400' },
  { char: 'L', label: '광원', bg: 'bg-yellow-400 border-yellow-300 text-black font-black' },
  { char: 'H', label: '깊은 구멍', bg: 'bg-neutral-950 border-neutral-800 text-neutral-600 font-bold' },
]

export function MapEditorScreen() {
  const [mapData, setMapData] = useState<MapData>(() => {
    // map.json 복사
    return JSON.parse(JSON.stringify(assets.map))
  })

  const [selectedFloorIdx, setSelectedFloorIdx] = useState<number>(0)
  const [selectedRoomIdx, setSelectedRoomIdx] = useState<number>(0)
  const [selectedTileChar, setSelectedTileChar] = useState<string>('#')

  // 테스트 플레이 관련 상태
  const [testEngine, setTestEngine] = useState<GameEngine | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  // 방 추가 모달 또는 상태
  const [newRoomId, setNewRoomId] = useState('')
  const [newRoomRows, setNewRoomRows] = useState(8)
  const [newRoomCols, setNewRoomCols] = useState(8)

  const currentFloor = mapData.floors[selectedFloorIdx]
  const currentRoom = currentFloor?.rooms[selectedRoomIdx]

  // 타일 수정
  const handleCellClick = (rowIdx: number, colIdx: number) => {
    if (!currentRoom) return

    const updatedMap = { ...mapData }
    const updatedGrid = updatedMap.floors[selectedFloorIdx].rooms[selectedRoomIdx].grid.map((row, rIdx) => {
      if (rIdx !== rowIdx) return row
      return row.map((cell, cIdx) => {
        if (cIdx !== colIdx) return cell
        return selectedTileChar
      })
    })

    updatedMap.floors[selectedFloorIdx].rooms[selectedRoomIdx].grid = updatedGrid
    setMapData(updatedMap)
  }

  // 층 추가
  const handleAddFloor = () => {
    const nextFloorNumber = mapData.floors.length > 0 
      ? Math.max(...mapData.floors.map(f => f.floor_number)) + 1 
      : 0

    const newFloor = {
      floor_number: nextFloorNumber,
      rooms: [
        {
          room_id: `${nextFloorNumber}-1`,
          grid: Array(6).fill(null).map(() => Array(6).fill('#'))
        }
      ]
    }

    const updated = {
      ...mapData,
      floors: [...mapData.floors, newFloor]
    }
    setMapData(updated)
    setSelectedFloorIdx(updated.floors.length - 1)
    setSelectedRoomIdx(0)
  }

  // 층 삭제
  const handleRemoveFloor = (floorIdx: number) => {
    if (mapData.floors.length <= 1) {
      alert('최소한 하나의 층은 존재해야 합니다.')
      return
    }
    if (!confirm('정말로 이 층을 삭제하시겠습니까? 모든 하위 방이 제거됩니다.')) return

    const updatedFloors = mapData.floors.filter((_, idx) => idx !== floorIdx)
    setMapData({ ...mapData, floors: updatedFloors })
    setSelectedFloorIdx(0)
    setSelectedRoomIdx(0)
  }

  // 방 추가
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomId.trim()) {
      alert('방 ID를 입력하세요.')
      return
    }

    // 중복 체크
    const exists = currentFloor.rooms.some(r => r.room_id === newRoomId.trim())
    if (exists) {
      alert('이미 존재하는 방 ID입니다.')
      return
    }

    const newGrid = Array(Number(newRoomRows))
      .fill(null)
      .map(() => Array(Number(newRoomCols)).fill('#'))

    const newRoom = {
      room_id: newRoomId.trim(),
      grid: newGrid
    }

    const updatedFloors = mapData.floors.map((floor, fIdx) => {
      if (fIdx !== selectedFloorIdx) return floor
      return {
        ...floor,
        rooms: [...floor.rooms, newRoom]
      }
    })

    setMapData({ ...mapData, floors: updatedFloors })
    setSelectedRoomIdx(currentFloor.rooms.length)
    setNewRoomId('')
  }

  // 방 삭제
  const handleRemoveRoom = (roomIdx: number) => {
    if (currentFloor.rooms.length <= 1) {
      alert('층에 최소한 하나의 방은 있어야 합니다.')
      return
    }
    if (!confirm('정말로 이 방을 삭제하시겠습니까?')) return

    const updatedRooms = currentFloor.rooms.filter((_, idx) => idx !== roomIdx)
    const updatedFloors = mapData.floors.map((floor, fIdx) => {
      if (fIdx !== selectedFloorIdx) return floor
      return { ...floor, rooms: updatedRooms }
    })

    setMapData({ ...mapData, floors: updatedFloors })
    setSelectedRoomIdx(0)
  }

  // 격자 행/열 크기 수정
  const resizeGrid = (action: 'add_row' | 'remove_row' | 'add_col' | 'remove_col') => {
    if (!currentRoom) return

    const updatedFloors = mapData.floors.map((floor, fIdx) => {
      if (fIdx !== selectedFloorIdx) return floor

      const updatedRooms = floor.rooms.map((room, rIdx) => {
        if (rIdx !== selectedRoomIdx) return room

        let newGrid = [...room.grid.map(row => [...row])]

        if (action === 'add_row') {
          const colCount = newGrid[0]?.length || 4
          newGrid.push(Array(colCount).fill('#'))
        } else if (action === 'remove_row') {
          if (newGrid.length <= 2) {
            alert('최소 행 크기는 2입니다.')
            return room
          }
          newGrid.pop()
        } else if (action === 'add_col') {
          newGrid = newGrid.map(row => [...row, '#'])
        } else if (action === 'remove_col') {
          if ((newGrid[0]?.length || 0) <= 2) {
            alert('최소 열 크기는 2입니다.')
            return room
          }
          newGrid = newGrid.map(row => {
            const nextRow = [...row]
            nextRow.pop()
            return nextRow
          })
        }

        return { ...room, grid: newGrid }
      })

      return { ...floor, rooms: updatedRooms }
    })

    setMapData({ ...mapData, floors: updatedFloors })
  }

  // 실행 (테스트 플레이) 버튼 클릭
  const handleRunTest = () => {
    // 맵 데이터 무결성 검사
    // 시작점 'S' 가 있는지 확인
    let hasStart = false
    for (const floor of mapData.floors) {
      for (const room of floor.rooms) {
        for (const row of room.grid) {
          if (row.includes('S')) {
            hasStart = true
            break
          }
        }
        if (hasStart) break
      }
      if (hasStart) break
    }

    if (!hasStart) {
      alert('테스트를 시작하려면 맵에 최소한 하나의 시작점(S) 타일이 있어야 합니다!')
      return
    }

    // 임시 엔진 생성
    try {
      const engine = new GameEngine(mapData, 'ko')
      engine.start()
      setTestEngine(engine)
      setIsTesting(true)
    } catch (err: any) {
      alert(`엔진 초기화 중 오류가 발생했습니다: ${err.message || err}`)
    }
  }

  // 다운로드 버튼 클릭
  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(mapData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', 'map.json')
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  if (isTesting && testEngine) {
    return (
      <div className="relative w-full h-full min-h-screen bg-black">
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          <button
            onClick={() => {
              setIsTesting(false)
              setTestEngine(null)
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-lg cursor-pointer transition-colors"
          >
            ← 테스트 종료 (Exit Test)
          </button>
        </div>
        <GameProvider customEngine={testEngine}>
          <GameScreen backToTitle={() => {
            setIsTesting(false)
            setTestEngine(null)
          }} />
        </GameProvider>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans">
      {/* 헤더 */}
      <header className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-white tracking-wider">WRITEHOUSE MAP EDITOR</h1>
          <a
            href="/"
            className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded transition"
          >
            게임으로 돌아가기
          </a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunTest}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition shadow-md cursor-pointer"
          >
            <span>▶</span> 실행 (Test)
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-bold transition shadow-md cursor-pointer"
          >
            <span>⬇</span> 다운로드 (JSON)
          </button>
        </div>
      </header>

      {/* 메인 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 사이드바 */}
        <aside className="w-80 bg-neutral-950 border-r border-neutral-800 p-5 flex flex-col gap-6 overflow-y-auto shrink-0">
          {/* 층 선택 및 관리 */}
          <section className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">층 (Floors)</h2>
              <button
                onClick={handleAddFloor}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 rounded"
              >
                + 층 추가
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {mapData.floors.map((floor, idx) => (
                <div
                  key={floor.floor_number}
                  className={`flex items-center rounded overflow-hidden text-sm font-bold border transition ${
                    selectedFloorIdx === idx
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedFloorIdx(idx)
                      setSelectedRoomIdx(0)
                    }}
                    className="px-3 py-1.5"
                  >
                    {floor.floor_number}F
                  </button>
                  <button
                    onClick={() => handleRemoveFloor(idx)}
                    className="px-2 py-1.5 bg-black/20 hover:bg-red-600/50 hover:text-white text-neutral-400 border-l border-neutral-800/40"
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
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">방 목록 (Rooms)</h2>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border border-neutral-800 rounded bg-neutral-900 p-1">
              {currentFloor?.rooms.map((room, idx) => (
                <div
                  key={room.room_id}
                  className={`flex justify-between items-center px-3 py-2 rounded text-sm font-semibold transition ${
                    selectedRoomIdx === idx
                      ? 'bg-neutral-800 text-white border border-neutral-700'
                      : 'text-neutral-400 hover:bg-neutral-900/50'
                  }`}
                >
                  <button
                    onClick={() => setSelectedRoomIdx(idx)}
                    className="flex-1 text-left"
                  >
                    🏠 {room.room_id}
                  </button>
                  <button
                    onClick={() => handleRemoveRoom(idx)}
                    className="text-neutral-500 hover:text-red-500 font-bold px-1"
                    title="방 삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* 새 방 추가 양식 */}
            <form onSubmit={handleAddRoom} className="mt-2 p-3 bg-neutral-900 border border-neutral-800 rounded flex flex-col gap-2.5">
              <div className="text-xs font-bold text-neutral-300">새 방 추가</div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-neutral-500">방 ID (예: 0-3)</label>
                <input
                  type="text"
                  value={newRoomId}
                  onChange={(e) => setNewRoomId(e.target.value)}
                  placeholder="예: 0-3"
                  className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-neutral-500 font-bold">행 (Rows)</label>
                  <input
                    type="number"
                    min="2"
                    max="40"
                    value={newRoomRows}
                    onChange={(e) => setNewRoomRows(Number(e.target.value))}
                    className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-neutral-500 font-bold">열 (Cols)</label>
                  <input
                    type="number"
                    min="2"
                    max="40"
                    value={newRoomCols}
                    onChange={(e) => setNewRoomCols(Number(e.target.value))}
                    className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-1.5 text-xs font-bold transition mt-1"
              >
                + 방 추가
              </button>
            </form>
          </section>

          {/* 격자 크기 변경 버튼 */}
          {currentRoom && (
            <section className="flex flex-col gap-2 border-t border-neutral-800 pt-4">
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">방 크기 조절 ({currentRoom.grid.length} × {currentRoom.grid[0]?.length || 0})</h2>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => resizeGrid('add_row')}
                  className="bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs py-2 rounded font-semibold transition"
                >
                  + 행 (Row) 추가
                </button>
                <button
                  onClick={() => resizeGrid('remove_row')}
                  className="bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs py-2 rounded font-semibold transition"
                >
                  - 행 (Row) 삭제
                </button>
                <button
                  onClick={() => resizeGrid('add_col')}
                  className="bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs py-2 rounded font-semibold transition"
                >
                  + 열 (Col) 추가
                </button>
                <button
                  onClick={() => resizeGrid('remove_col')}
                  className="bg-neutral-850 hover:bg-neutral-800 text-neutral-200 text-xs py-2 rounded font-semibold transition"
                >
                  - 열 (Col) 삭제
                </button>
              </div>
            </section>
          )}
        </aside>

        {/* 메인 에디팅 공간 */}
        <main className="flex-1 bg-neutral-900 p-6 flex flex-col gap-4 overflow-hidden">
          {currentRoom ? (
            <div className="flex-1 flex gap-6 overflow-hidden">
              {/* 그리드 영역 */}
              <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg p-6 flex items-center justify-center overflow-auto">
                <div className="flex flex-col border border-neutral-800 shadow-2xl">
                  {currentRoom.grid.map((row, rIdx) => (
                    <div key={rIdx} className="flex">
                      {row.map((cell, cIdx) => {
                        const paletteInfo = PALETTE_TILES.find(t => t.char === cell) || { bg: 'bg-neutral-800 text-neutral-500 border-neutral-750' }
                        return (
                          <button
                            key={cIdx}
                            onClick={() => handleCellClick(rIdx, cIdx)}
                            className={`w-10 h-10 border flex items-center justify-center text-sm font-mono cursor-pointer transition-colors select-none ${paletteInfo.bg}`}
                            title={`Row: ${rIdx}, Col: ${cIdx} [${cell || '빈값'}]`}
                          >
                            {cell || ' '}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* 타일 팔레트 영역 */}
              <div className="w-72 bg-neutral-950 border border-neutral-800 rounded-lg p-4 flex flex-col gap-3 shrink-0 overflow-y-auto">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">타일 선택 (Palette)</h3>
                <div className="flex flex-col gap-1.5">
                  {PALETTE_TILES.map((tile) => (
                    <button
                      key={tile.char}
                      onClick={() => setSelectedTileChar(tile.char)}
                      className={`flex items-center gap-3 px-3 py-2 rounded border text-left text-xs transition ${
                        selectedTileChar === tile.char
                          ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                          : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-850 text-neutral-400'
                      }`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center font-mono border text-sm shrink-0 rounded ${tile.bg}`}>
                        {tile.char}
                      </div>
                      <span className="truncate">{tile.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
              선택된 방이 없습니다. 왼쪽 사이드바에서 방을 추가하거나 선택해 주세요.
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
