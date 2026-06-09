import { MapEditorProvider, useMapEditorContext } from './map-editor/context/MapEditorContext'
import { Header } from './map-editor/components/Header'
import { Sidebar } from './map-editor/components/Sidebar'
import { GridEditor } from './map-editor/components/GridEditor'
import { Palette } from './map-editor/components/Palette'
import { GameProvider } from '~/context/GameContext'
import { GameScreen } from './GameScreen'

function MapEditorContent() {
  const { currentRoom, isTesting, testEngine, setIsTesting, setTestEngine } = useMapEditorContext()

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
          <GameScreen
            backToTitle={() => {
              setIsTesting(false)
              setTestEngine(null)
            }}
          />
        </GameProvider>
      </div>
    )
  }

  return (
    <div className="w-full h-full max-h-screen min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 bg-neutral-900 p-2 flex flex-col gap-2 overflow-hidden">
          {currentRoom ? (
            <div className="flex-1 flex gap-2 overflow-hidden">
              <GridEditor />
              <Palette />
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

export function MapEditorScreen() {
  return (
    <MapEditorProvider>
      <MapEditorContent />
    </MapEditorProvider>
  )
}

export default MapEditorScreen
