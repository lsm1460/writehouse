import { useState } from 'react'
import { assets } from '~/assets'
import { GameEngine, type MapData } from '~/core/gameEngine'

const DEFAULT_BLANK_MAP: MapData = {
  floors: [
    {
      floor_number: 0,
      rooms: [
        {
          room_id: '0-1',
          grid: [
            ['#', '#', '#', '#', '#', '#', '#', '#'],
            ['#', 'S', ' ', ' ', ' ', 'G', ' ', '#'],
            ['#', '#', '#', '#', '#', '#', '#', '#'],
          ]
        }
      ]
    }
  ]
}

export function useMapEditor() {
  const [mapData, setMapData] = useState<MapData>(() => {
    // 기본적으로 빈 템플릿에서 시작
    return JSON.parse(JSON.stringify(DEFAULT_BLANK_MAP))
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

  // 기존 게임 맵 불러오기
  const handleLoadGameMap = () => {
    if (confirm('현재 편집 중인 데이터가 사라지고 기존 게임 맵을 불러옵니다. 계속하시겠습니까?')) {
      setMapData(JSON.parse(JSON.stringify(assets.map)))
      setSelectedFloorIdx(0)
      setSelectedRoomIdx(0)
    }
  }

  // JSON 데이터 직접 임포트
  const handleImportMap = (importedData: MapData) => {
    // 유효성 최소한으로 검사
    if (!importedData || !Array.isArray(importedData.floors)) {
      alert('올바르지 않은 맵 데이터 형식입니다.')
      return
    }
    setMapData(importedData)
    setSelectedFloorIdx(0)
    setSelectedRoomIdx(0)
  }

  // 새롭게 빈 도면으로 초기화
  const handleResetToBlank = () => {
    if (confirm('현재 편집 중인 데이터가 완전히 초기화됩니다. 계속하시겠습니까?')) {
      setMapData(JSON.parse(JSON.stringify(DEFAULT_BLANK_MAP)))
      setSelectedFloorIdx(0)
      setSelectedRoomIdx(0)
    }
  }

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

  return {
    mapData,
    selectedFloorIdx,
    setSelectedFloorIdx,
    selectedRoomIdx,
    setSelectedRoomIdx,
    selectedTileChar,
    setSelectedTileChar,
    testEngine,
    setTestEngine,
    isTesting,
    setIsTesting,
    newRoomId,
    setNewRoomId,
    newRoomRows,
    setNewRoomRows,
    newRoomCols,
    setNewRoomCols,
    currentFloor,
    currentRoom,
    handleCellClick,
    handleAddFloor,
    handleRemoveFloor,
    handleAddRoom,
    handleRemoveRoom,
    resizeGrid,
    handleRunTest,
    handleDownload,
    handleLoadGameMap,
    handleImportMap,
    handleResetToBlank,
  }
}
