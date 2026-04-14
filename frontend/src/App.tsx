import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import AuctionPage from './pages/AuctionPage'
import ProfilePage from './pages/ProfilePage'

const MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`

function App() {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuctionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </TonConnectUIProvider>
  )
}

export default App
