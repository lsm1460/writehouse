import { useEffect, useState } from 'react'
import { SaveIndicator } from '~/components/ui/SaveIndicator'
import { useGame } from '~/context/GameContext'
import { tauriService } from '~/services/tauriService'
import { ConfigScreen } from './screens/ConfigScreen'
import { EndingScreen } from './screens/EndingScreen'
import { GameScreen } from './screens/GameScreen'
import { StageSelectScreen } from './screens/StageSelectScreen'
import { TitleScreen } from './screens/TitleScreen'

type GameStateType = 'TITLE' | 'STAGESELECT' | 'CONFIG' | 'PLAYING' | 'ENDING'

function App() {
  const { save, engine, gameState: engineStatus } = useGame()
  const [isFontReady, setIsFontReady] = useState(false)
  const [shouldRenderOverlay, setShouldRenderOverlay] = useState(true)
  const [gameState, setGameState] = useState<GameStateType>('TITLE')

  useEffect(() => {
    if (engineStatus === 'TITLE') {
      setGameState('TITLE')
    }
  }, [engineStatus])

  useEffect(() => {
    async function initGame() {
      try {
        await document.fonts.ready
        setIsFontReady(true)

        if (tauriService && typeof tauriService.showWindow === 'function') {
          await tauriService.showWindow()
        }
      } catch (error) {
        console.error('Initialization failed:', error)
        setIsFontReady(true)
      }
    }

    initGame()

    const preventContextMenu = (e: MouseEvent) => {
      // e.preventDefault()
    }
    document.addEventListener('contextmenu', preventContextMenu)
    return () => document.removeEventListener('contextmenu', preventContextMenu)
  }, [])

  useEffect(() => {
    if (isFontReady) {
      const timer = setTimeout(() => {
        setShouldRenderOverlay(false)
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [isFontReady])

  const backToTitle = () => {
    setGameState('TITLE')
  }

  const handleStart = (roomId?: string) => {
    engine.start(roomId)
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
        onStageSelect={() => setGameState('STAGESELECT')}
        onConfig={() => setGameState('CONFIG')}
        onExit={() => tauriService.exitGame()}
        {...(save.hasSaveData() && { onLoad: handleLoad })}
      />
    ),
    STAGESELECT: <StageSelectScreen onStart={handleStart} onBack={backToTitle} />,
    CONFIG: <ConfigScreen back={backToTitle} />,
    PLAYING: <GameScreen backToTitle={backToTitle} onEnding={handleEnding} />,
    ENDING: <EndingScreen back={backToTitle} />,
  }

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden select-none">
      <div className="w-full h-full min-h-screen">{screens[gameState]}</div>

      {shouldRenderOverlay && <div className={`absolute inset-0 z-50 bg-black transition-opacity duration-700 ease-in-out ${isFontReady ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />}

      <SaveIndicator />
    </div>
  )
}

export default App
