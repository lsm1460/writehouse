import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import { GameProvider } from './context/GameContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <GameProvider>
    <App />
  </GameProvider>
)
