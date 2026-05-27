import { useState } from 'react'
import { useGame } from '~/context/GameContext'
//
import { GameScreen } from './screens/GameScreen'
import { TitleScreen } from './screens/TitleScreen'
import { ConfigScreen } from './screens/ConfigScreen'

function App() {
  const { save, engine } = useGame()

  const [gameState, setGameState] = useState<'TITLE' | 'CONFIG' | 'PLAYING'>('TITLE')

  const backToTitle = () => {
    setGameState('TITLE')
  }

  if (gameState === 'TITLE') {
    return (
      <TitleScreen
        onStart={() => {
          engine.start()

          setGameState('PLAYING')
        }}
        {...(save.hasSaveData() && {
          onLoad: () => {
            engine.load()

            setGameState('PLAYING')
          },
        })}
        onConfig={() => setGameState('CONFIG')}
        onExit={() => {}}
      />
    )
  } else if (gameState === 'CONFIG') {
    return <ConfigScreen backToTitle={backToTitle} />
  }

  return <GameScreen backToTitle={backToTitle} />
}

export default App
