import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { assets } from '~/assets'
import { GameEngine } from '~/core/gameEngine'

interface GameContextType {
  engine: GameEngine
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const engine = useMemo(() => new GameEngine(assets.map), [])

  useSyncExternalStore(
    (callback) => {
      engine.subscribe(callback)
      return () => {}
    },
    () => engine.getSnapshot()
  )

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
    gameState: context.engine.gameStatus,
    save: context.engine.ctx.save
  }
}
