import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { assets } from '~/assets'
import { GameEngine } from '~/core/gameEngine'
import i18n from '~/i18n'

interface GameContextType {
  engine: GameEngine
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children, customEngine }: { children: ReactNode; customEngine?: GameEngine }) {
  const engine = useMemo(() => customEngine || new GameEngine(assets.map, i18n.language), [customEngine])

  useSyncExternalStore(
    (callback) => {
      engine.subscribe(callback)
      return () => {}
    },
    () => engine.getSnapshot()
  )

  useEffect(() => {
    const saveData = engine.ctx.save.load()
    if (saveData && saveData.language) {
      i18n.changeLanguage(saveData.language)
    }
  }, [engine])

  return <GameContext.Provider value={{ engine }}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame은 반드시 GameProvider 안에서 사용되어야 합니다.')
  }
  return {
    engine: context.engine,
    ctx: context.engine.ctx,
    player: context.engine.ctx.player,
    map: context.engine.ctx.map,
    fog: context.engine.ctx.fog,
    stageClear: context.engine.ctx.stageClear,
    // inventory: context.engine.ctx.inventory,
    turn: context.engine.ctx.turn,
    gameState: context.engine.gameStatus,
    toggleMenu: context.engine.toggleMenu,
    save: context.engine.ctx.save,
    currentRoomId: context.engine.ctx.map.currentRoomId,
    isSaving: context.engine.ctx.save.isSaving,
  }
}
