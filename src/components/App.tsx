import { useState } from 'react'
import { useGame } from '~/context/GameContext'
import { GameScreen } from './screens/GameScreen'
import { TitleScreen } from './screens/TitleScreen'
import { ConfigScreen } from './screens/ConfigScreen'
import { SaveIndicator } from '~/components/ui/SaveIndicator'
import { MapEditorScreen } from './screens/MapEditorScreen'

type GameStateType = 'TITLE' | 'CONFIG' | 'PLAYING'

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

  const screens: Record<GameStateType, React.ReactNode> = {
    TITLE: (
      <TitleScreen
        onStart={handleStart}
        onConfig={() => setGameState('CONFIG')}
        onExit={() => {}}
        {...(save.hasSaveData() && { onLoad: handleLoad })}
      />
    ),
    CONFIG: <ConfigScreen backToTitle={backToTitle} />,
    PLAYING: <GameScreen backToTitle={backToTitle} />,
  }

  return (
    <div className="relative w-full h-full min-h-screen bg-[#0a0a0c] overflow-hidden select-none">
      {screens[gameState]}
      <SaveIndicator />
    </div>
  )
}

export default App
