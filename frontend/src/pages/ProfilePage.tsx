import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { useLaunchParams, useRawInitData } from '@telegram-apps/sdk-react'
import { backend } from '../api/backend'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [tonConnectUI] = useTonConnectUI()
  const walletAddress = useTonAddress()
  const lp = useLaunchParams()
  const rawInitData = useRawInitData() ?? ''

  const user = lp.tgWebAppData?.user as { username?: string; firstName?: string } | undefined

  const [avatar, setAvatar] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Получаем аватарку с backend
  useEffect(() => {
    if (!rawInitData) return
    backend.getProfile(rawInitData)
      .then(p => setAvatar(p.avatar_url))
      .catch(() => {})
  }, [rawInitData])

  // Сохраняем связку wallet↔telegram при подключении кошелька
  useEffect(() => {
    if (!walletAddress || !rawInitData || saved) return
    setSaveError(null)
    backend.connectWallet(walletAddress, user?.username ?? null, avatar, rawInitData)
      .then(() => setSaved(true))
      .catch((e: Error) => setSaveError(e.message))
  }, [walletAddress, rawInitData, saved])

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
              <p style={{ fontSize: 12, color: saved ? 'var(--success)' : saveError ? '#ff4444' : 'var(--text-secondary)' }}>
                {saved ? '✓ Кошелёк привязан' : saveError ? `Ошибка: ${saveError}` : 'Сохранение...'}
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
