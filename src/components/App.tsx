import { useState } from 'react'
import { useGame } from '~/context/GameContext'
//
import { GameScreen } from './screens/GameScreen'
import { TitleScreen } from './screens/TitleScreen'

function App() {
  const { save, engine } = useGame()

  const [gameState, setGameState] = useState<'TITLE' | 'PLAYING'>('TITLE')

  if (gameState === 'TITLE') {
    return (
      <TitleScreen
        onStart={() => setGameState('PLAYING')}
        {...(save.hasSaveData() && {
          onLoad: () => {
            engine.load()

            setGameState('PLAYING')
          },
        })}
        onExit={() => {}}
      />
    )
  }

  return <GameScreen />
}

export default App
