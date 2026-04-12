import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { init, mockTelegramEnv, isTMA } from '@telegram-apps/sdk'
import App from './App.tsx'
import './index.css'

// В браузере вне Telegram — подставляем mock окружение для разработки
if (!isTMA()) {
  mockTelegramEnv({
    launchParams: new URLSearchParams([
      ['tgWebAppPlatform', 'tdesktop'],
      ['tgWebAppVersion', '8.0'],
      ['tgWebAppThemeParams', JSON.stringify({ bg_color: '#212121', text_color: '#ffffff', button_color: '#2ea6ff', button_text_color: '#ffffff' })],
    ]),
  })
}

init()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
