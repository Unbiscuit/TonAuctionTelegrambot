import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { toNano, beginCell } from '@ton/core'
import { useAuction } from '../hooks/useAuction'
import { Timer } from '../components/Timer'
import { LeaderCard } from '../components/LeaderCard'
import { backend } from '../api/backend'

export default function AuctionPage() {
  const navigate = useNavigate()
  const { state, loading, error, refetch } = useAuction()
  const [tonConnectUI] = useTonConnectUI()
  const walletAddress = useTonAddress()
  const [bidInput, setBidInput] = useState('')
  const [sending, setSending] = useState(false)

  const handleConnect = async () => {
    await tonConnectUI.openModal()
  }

  const handleBid = async () => {
    if (!bidInput || !state) return
    const bidNano = toNano(bidInput)

    const minIncrement = toNano('0.1')
    const minRequired = state.highestBid > 0n
      ? state.highestBid + minIncrement
      : state.minBid

    if (bidNano < minRequired) {
      if (state.highestBid > 0n) {
        alert(`Минимальная ставка: ${(Number(minRequired) / 1e9).toFixed(2)} TON (подъём не менее 0.1 TON)`)
      } else {
        alert(`Минимальная ставка: ${(Number(state.minBid) / 1e9).toFixed(2)} TON`)
      }
      return
    }

    setSending(true)
    try {
      const prevBidder = state.highestBid > 0n ? state.highestBidder.toString() : null

      const payload = beginCell().storeUint(0x42, 32).endCell().toBoc().toString('base64')

      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{
          address: import.meta.env.VITE_CONTRACT_ADDRESS,
          amount: bidNano.toString(),
          payload,
        }],
      })

      // Уведомляем предыдущего лидера
      if (prevBidder) {
        await backend.notifyBid(prevBidder, Number(bidInput))
      }

      setBidInput('')
      setTimeout(refetch, 5000) // обновляем состояние через 5 сек
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="page page--center">Загрузка...</div>
  if (error) return <div className="page page--center">{error}</div>

  const minBidTon = state
    ? state.highestBid > 0n
      ? ((Number(state.highestBid) + 1e8) / 1e9).toFixed(2)
      : (Number(state.minBid) / 1e9).toFixed(2)
    : '0'

  return (
    <div className="page">
      <header className="header">
        <h1 className="header__title">TON Auction</h1>
        <button className="header__profile" onClick={() => navigate('/profile')}>
          👤
          {!walletAddress && <span className="header__profile-dot" />}
        </button>
      </header>

      <main className="main">
        {!state?.active && !state?.finalized && (
          <div className="status-card">
            <p>Аукцион ещё не запущен</p>
          </div>
        )}

        {state?.active && (
          <>
            <div className="timer-block">
              <span className="timer-label">До конца аукциона</span>
              <Timer endTime={state.endTime} />
            </div>

            <div className="leader-block">
              <span className="leader-label">🥇 Лидер</span>
              {state.highestBid > 0n
                ? <LeaderCard
                    walletAddress={state.highestBidder.toString()}
                    bid={state.highestBid}
                  />
                : <p className="no-bids">Ставок пока нет. Будь первым!</p>
              }
            </div>

            <div className="bid-block">
              <p className="bid-min">Мин. ставка: {minBidTon} TON</p>
              {!walletAddress ? (
                <button className="btn btn--primary" onClick={handleConnect}>
                  Подключить кошелёк
                </button>
              ) : (
                <div className="bid-form">
                  <input
                    className="bid-input"
                    type="number"
                    placeholder="Сумма в TON"
                    value={bidInput}
                    onChange={e => setBidInput(e.target.value)}
                    min={minBidTon}
                    step="0.1"
                  />
                  <button
                    className="btn btn--primary"
                    onClick={handleBid}
                    disabled={sending || !bidInput}
                  >
                    {sending ? 'Отправка...' : 'Сделать ставку'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {state?.finalized && (
          <div className="status-card status-card--winner">
            <p>🏆 Аукцион завершён!</p>
            {state.highestBid > 0n && (
              <LeaderCard
                walletAddress={state.highestBidder.toString()}
                bid={state.highestBid}
              />
            )}
            <p className="claim-hint">Победитель — напиши боту /claim</p>
          </div>
        )}
      </main>
    </div>
  )
}
