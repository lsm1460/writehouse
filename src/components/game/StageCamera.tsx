import { type ReactNode } from 'react'

interface StageCameraProps {
  offsetX: number
  offsetY: number
  paddingTop: number
  paddingLeft: number
  mapWidth: number
  mapHeight: number
  children: ReactNode
}

export function StageCamera({
  offsetX,
  offsetY,
  paddingTop,
  paddingLeft,
  mapWidth,
  mapHeight,
  children,
}: StageCameraProps) {
  return (
    <div className="absolute flex flex-col p-4 bg-black select-none">
      <div
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          width: `${mapWidth}px`,
          height: `${mapHeight}px`,
        }}
        className="relative flex flex-col transition-transform duration-200 ease-out"
      >
        <div
          style={{
            transform: `translate(${paddingLeft}px, ${paddingTop}px)`,
          }}
          className="flex flex-col"
        >
          {children}
        </div>
      </div>
    </div>
  )
}