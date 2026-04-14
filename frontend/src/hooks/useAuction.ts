import { useEffect, useState, useCallback } from 'react'
import { TonClient, Address } from '@ton/ton'
import { Auction } from '../contracts/Auction'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || ''

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
})

export type AuctionState = {
  active: boolean
  finalized: boolean
  minBid: bigint
  endTime: bigint
  highestBidder: Address
  highestBid: bigint
}

export function useAuction() {
  const [state, setState] = useState<AuctionState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      const contract = client.open(Auction.fromAddress(Address.parse(CONTRACT_ADDRESS)))
      const s = await contract.getState()
      setState(s)
      setError(null)
    } catch (e) {
      setError('Не удалось загрузить данные аукциона')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, 10000) // обновляем каждые 10 сек
    return () => clearInterval(interval)
  }, [fetch])

  return { state, loading, error, refetch: fetch }
}
