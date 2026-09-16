import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import logoImage from './assets/logo.png'
import './index.css'
import App from './App.tsx'

const favicon = document.querySelector<HTMLLinkElement>('#mensera-favicon')
if (favicon) favicon.href = logoImage

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
