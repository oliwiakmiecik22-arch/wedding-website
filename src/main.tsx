import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/antic-didone/latin-400.css'
import '@fontsource/estonia/latin-400.css'
import '@fontsource/gowun-batang/latin-ext-400.css'
import '@fontsource/gowun-batang/latin-ext-700.css'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
