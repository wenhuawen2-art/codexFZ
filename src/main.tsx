import 'core-js/stable'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { setupAutofit, teardownAutofit } from './lib/autofit'

setupAutofit(import.meta.env.DEV)

if (import.meta.hot) {
  import.meta.hot.dispose(() => teardownAutofit())
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
