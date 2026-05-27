import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import { GameProvider } from './context/GameContext.tsx'
import './index.css'
import './i18n'

createRoot(document.getElementById('root')!).render(
  <GameProvider>
    <App />
  </GameProvider>
)
