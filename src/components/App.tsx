import { useEffect, useState } from 'react'
import { SaveIndicator } from '~/components/ui/SaveIndicator'
import { useGame } from '~/context/GameContext'
import { tauriService } from '~/services/tauriService'
import { ConfigScreen } from './screens/ConfigScreen'
import { EndingScreen } from './screens/EndingScreen'
import { GameScreen } from './screens/GameScreen'
import { TitleScreen } from './screens/TitleScreen'

type GameStateType = 'TITLE' | 'CONFIG' | 'PLAYING' | 'ENDING'

function App() {
  const { save, engine } = useGame()
  const [isFontReady, setIsFontReady] = useState(false)
  const [shouldRenderOverlay, setShouldRenderOverlay] = useState(true) // 페이드 효과용 오버레이 유지 상태
  const [gameState, setGameState] = useState<GameStateType>('TITLE')

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
      e.preventDefault()
    }

    document.addEventListener('contextmenu', preventContextMenu)

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu)
    }
  }, [])

  useEffect(() => {
    if (isFontReady) {
      const timer = setTimeout(() => {
        setShouldRenderOverlay(false)
      }, 700) // 아래 Tailwind의 duration-700과 일치시킵니다.
      return () => clearTimeout(timer)
    }
  }, [isFontReady])

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
    TITLE: <TitleScreen onStart={handleStart} onConfig={() => setGameState('CONFIG')} onExit={() => tauriService.exitGame()} {...(save.hasSaveData() && { onLoad: handleLoad })} />,
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
