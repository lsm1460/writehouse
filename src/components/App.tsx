import { useState } from 'react'
import { SaveIndicator } from '~/components/ui/SaveIndicator'
import { useGame } from '~/context/GameContext'
import { ConfigScreen } from './screens/ConfigScreen'
import { EndingScreen } from './screens/EndingScreen'
import { GameScreen } from './screens/GameScreen'
import { MapEditorScreen } from './screens/MapEditorScreen'
import { TitleScreen } from './screens/TitleScreen'

type GameStateType = 'TITLE' | 'CONFIG' | 'PLAYING' | 'ENDING'

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

  const handleEnding = () => {
    setGameState('ENDING')
  }

  const screens: Record<GameStateType, React.ReactNode> = {
    TITLE: (
      <TitleScreen
        onStart={handleStart}
        onConfig={() => setGameState('CONFIG')}
        onExit={() => {}}
        {...(save.hasSaveData() && { onLoad: handleLoad })}
      />
    ),
    CONFIG: <ConfigScreen back={backToTitle} />,
    PLAYING: <GameScreen backToTitle={backToTitle} onEnding={handleEnding} />,
    ENDING: <EndingScreen back={backToTitle} />,
  }

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden select-none">
      {screens[gameState]}
      <SaveIndicator />
    </div>
  )
}

export default App
