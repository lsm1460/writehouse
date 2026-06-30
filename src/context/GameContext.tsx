import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { assets } from '~/assets'
import { GameEngine } from '~/core/gameEngine'
import i18n from '~/i18n'

interface GameContextType {
  engine: GameEngine
  isGameClear: boolean
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children, customEngine }: { children: ReactNode; customEngine?: GameEngine }) {
  const engine = useMemo(() => customEngine || new GameEngine(assets, i18n.language), [customEngine])

  const [isGameClear, setIsGameClear] = useState(false)
  
  useSyncExternalStore(
    (callback) => {
      engine.subscribe(() => {
        const isEngineEnding = engine.gameStatus === 'ENDING'
        
        if (isEngineEnding) {
          setIsGameClear(true)
        }
        callback()
      })

      return () => {}
    },
    () => engine.getSnapshot()
  )

  useEffect(() => {
    const saveData = engine.ctx.save.load()
    if (saveData && saveData.language) {
      i18n.changeLanguage(saveData.language)
    }

    if (saveData && typeof saveData.tooltipEnabled === 'boolean') {
      engine.ctx.config.setTooltipEnabled(saveData.tooltipEnabled)
    }

    if (saveData?.isClear) {
        setIsGameClear(true)
      }
  }, [engine])

  return <GameContext.Provider value={{ engine, isGameClear }}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame은 반드시 GameProvider 안에서 사용되어야 합니다.')
  }
  return {
    engine: context.engine,
    ctx: context.engine.ctx,
    isLoading: context.engine.ctx.isLoading,
    player: context.engine.ctx.player,
    map: context.engine.ctx.map,
    fog: context.engine.ctx.fog,
    config: context.engine.ctx.config,
    stageClear: context.engine.ctx.stageClear,
    deathEvents: context.engine.ctx.effects.deathEvents,
    // inventory: context.engine.ctx.inventory,
    turn: context.engine.ctx.turn,
    gameState: context.engine.gameStatus,
    togglePause: context.engine.togglePause,
    save: context.engine.ctx.save,
    currentRoomId: context.engine.ctx.map.currentRoomId,
    isSaving: context.engine.ctx.save.isSaving,
    isGameClear: context.isGameClear
  }
}
