import { createContext, useContext, type ReactNode } from 'react'
import { useMapEditor } from '../hooks/useMapEditor'

type MapEditorContextType = ReturnType<typeof useMapEditor>

const MapEditorContext = createContext<MapEditorContextType | null>(null)

export function MapEditorProvider({ children }: { children: ReactNode }) {
  const value = useMapEditor()
  return <MapEditorContext.Provider value={value}>{children}</MapEditorContext.Provider>
}

export function useMapEditorContext() {
  const context = useContext(MapEditorContext)
  if (!context) {
    throw new Error('useMapEditorContext must be used within a MapEditorProvider')
  }
  return context
}
