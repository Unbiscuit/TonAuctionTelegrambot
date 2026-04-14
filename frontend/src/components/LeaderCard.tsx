import { useEffect, useState } from 'react'
import { backend } from '../api/backend'

type Props = {
  walletAddress: string
  bid: bigint
}

type UserInfo = {
  username: string | null
  avatar_url: string | null
}

export function LeaderCard({ walletAddress, bid }: Props) {
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    backend.getUserByWallet(walletAddress)
      .then(setUser)
      .catch(() => setUser(null))
  }, [walletAddress])

  const tonAmount = (Number(bid) / 1e9).toFixed(2)
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`

  return (
    <div className="leader-card">
      <div className="leader-card__avatar">
        {user?.avatar_url
          ? <img src={user.avatar_url} alt="avatar" />
          : <div className="leader-card__avatar-placeholder">👤</div>
        }
      </div>
      <div className="leader-card__info">
        <span className="leader-card__name">
          {user?.username ? `@${user.username}` : shortAddress}
        </span>
        <span className="leader-card__bid">{tonAmount} TON</span>
      </div>
    </div>
  )
}
