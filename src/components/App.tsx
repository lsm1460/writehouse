import { useState } from 'react'
//
import { GameScreen } from './screens/GameScreen'
import { TitleScreen } from './screens/TitleScreen'

function App() {
  const [gameState, setGameState] = useState<'TITLE' | 'PLAYING'>('TITLE')

  if (gameState === 'TITLE') {
    return <TitleScreen onStart={() => setGameState('PLAYING')} />
  }

  return <GameScreen />
}

export default App
