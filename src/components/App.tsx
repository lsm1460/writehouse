import { useState } from 'react'
import { useGame } from '~/context/GameContext'
import { GameScreen } from './screens/GameScreen'
import { TitleScreen } from './screens/TitleScreen'
import { ConfigScreen } from './screens/ConfigScreen'
import { SaveIndicator } from '~/components/ui/SaveIndicator'
import { MapEditorScreen } from './screens/MapEditorScreen'
import { TestScreen } from './screens/TestScreen'

type GameStateType = 'TITLE' | 'CONFIG' | 'PLAYING' | 'TEST'

function App() {
  const isEditPath = window.location.pathname.startsWith('/edit')

  if (isEditPath) {
    return <MapEditorScreen />
  }

  const { save, engine } = useGame()
  const [gameState, setGameState] = useState<GameStateType>('TITLE')

  const backToTitle = () => {
    setGameState('TITLE')
  }

  const handleStart = () => {
    engine.start()
    setGameState('PLAYING')
  }

  const handleLoad = () => {
    engine.load()
    setGameState('PLAYING')
  }

  const handleTest = () => {
    engine.load()
    setGameState('TEST')
  }

  const screens: Record<GameStateType, React.ReactNode> = {
    TITLE: (
      <TitleScreen
        onStart={handleStart}
        onConfig={() => setGameState('CONFIG')}
        onExit={() => {}}
        onTest={handleTest}
        {...(save.hasSaveData() && { onLoad: handleLoad })}
      />
    ),
    CONFIG: <ConfigScreen backToTitle={backToTitle} />,
    PLAYING: <GameScreen backToTitle={backToTitle} />,
    TEST: <TestScreen backToTitle={backToTitle} />,
  }

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden select-none">
      {screens[gameState]}
      <SaveIndicator />
    </div>
  )
}

export default App
