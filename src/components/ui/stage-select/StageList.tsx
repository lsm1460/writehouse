import React, { forwardRef } from 'react'

interface Room {
  room_id: string
  grid: string[][]
}

interface Floor {
  floor_number: number
  rooms: Room[]
}

interface StageListProps {
  floors: Floor[]
  activeIndex: number
  onStageHover: (index: number) => void
  onStageSelect: (roomId: string) => void
  translate: (key: string, fallback: string) => string 
}

export const StageList = forwardRef<HTMLDivElement, StageListProps>(
  ({ floors, activeIndex, onStageHover, onStageSelect, translate }, ref) => {
    
    let currentAbsoluteIndex = 0

    return (
      <div 
        ref={ref}
        className="w-full h-full bg-neutral-950/50 border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800"
      >
        {floors.map((floor) => {
          const floorKey = `floors.${floor.floor_number}`
          const floorTitle = translate(floorKey, `${floor.floor_number}층`)

          return (
            <div key={floor.floor_number} className="flex flex-col gap-2">
              <div className="text-xs font-black text-neutral-500 tracking-wider px-1 uppercase">
                {floorTitle}
              </div>

              <div className="flex flex-col gap-1.5">
                {floor.rooms.map((room) => {
                  const idx = currentAbsoluteIndex++ // 절대 인덱스 계산 및 증가
                  const isActive = idx === activeIndex
                  
                  const roomNameKey = `rooms.${room.room_id}`
                  const roomName = translate(roomNameKey, room.room_id)

                  return (
                    <button
                      key={room.room_id}
                      data-index={idx}
                      onMouseEnter={() => onStageHover(idx)}
                      onClick={() => onStageSelect(room.room_id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition duration-150 select-none ${
                        isActive
                          ? 'bg-neutral-800 border-white text-white scale-[1.01] shadow-lg shadow-black/40'
                          : 'bg-neutral-900/40 border-neutral-800/60 text-neutral-400 hover:text-white hover:bg-neutral-800/40 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-sm font-bold truncate">
                        {roomName}
                      </span>
                      <span className={`text-xs font-mono font-bold shrink-0 ml-3 ${isActive ? 'text-white' : 'text-neutral-600'}`}>
                        {room.room_id}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)

StageList.displayName = 'StageList'