import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { useLaunchParams } from '@telegram-apps/sdk-react'
import { backend } from '../api/backend'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [tonConnectUI] = useTonConnectUI()
  const walletAddress = useTonAddress()
  const lp = useLaunchParams()

  const user = lp.tgWebAppData?.user as { username?: string; firstName?: string } | undefined
  const initData = lp.tgWebAppData ?? ''

  const [avatar, setAvatar] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Получаем аватарку с backend
  useEffect(() => {
    if (!initData) return
    backend.getProfile(String(initData))
      .then(p => setAvatar(p.avatar_url))
      .catch(() => {})
  }, [initData])

  // Сохраняем связку wallet↔telegram при подключении кошелька
  useEffect(() => {
    if (!walletAddress || !initData || saved) return
    backend.connectWallet(walletAddress, user?.username ?? null, avatar, String(initData))
      .then(() => setSaved(true))
      .catch(console.error)
  }, [walletAddress, initData, saved])

  return (
    <div className="page">
      <header className="header">
        <button className="header__back" onClick={() => navigate('/')}>←</button>
        <h1 className="header__title">Профиль</h1>
      </header>

      <main className="main main--center">
        <div className="profile-card">
          {avatar
            ? <img className="profile-card__avatar" src={avatar} alt="avatar" />
            : <div className="profile-card__avatar-placeholder">👤</div>
          }
          <p className="profile-card__name">
            {user?.username ? `@${user.username}` : user?.firstName ?? 'Пользователь'}
          </p>
        </div>

        <div className="wallet-block">
          {walletAddress ? (
            <>
              <p className="wallet-address">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
              </p>
              <button
                className="btn btn--secondary"
                onClick={() => tonConnectUI.disconnect()}
              >
                Отключить кошелёк
              </button>
            </>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => tonConnectUI.openModal()}
            >
              Подключить кошелёк
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
