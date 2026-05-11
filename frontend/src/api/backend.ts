const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit, initData?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(initData ? { 'x-init-data': initData } : {}),
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const backend = {
  connectWallet: (walletAddress: string, username: string | null, avatarUrl: string | null, initData: string) =>
    request('/api/users/connect', {
      method: 'POST',
      body: JSON.stringify({ wallet_address: walletAddress, username, avatar_url: avatarUrl }),
    }, initData),

  getProfile: (initData: string) =>
    request<{ wallet_address: string; username: string; avatar_url: string }>('/api/users/me', {}, initData),

  getAvatar: (initData: string) =>
    request<{ avatar_url: string | null }>('/api/users/avatar', {}, initData),

  getUserByWallet: (wallet: string) =>
    request<{ telegram_id: number; username: string; avatar_url: string }>(
      `/api/users/by-wallet?wallet=${encodeURIComponent(wallet)}`
    ),

  notifyBid: (outbidWallet: string, newAmount: number) =>
    request('/api/notify/bid', {
      method: 'POST',
      body: JSON.stringify({ outbid_wallet: outbidWallet, new_amount: newAmount }),
    }),

  notifyFinalized: (winnerWallet: string) =>
    request('/api/notify/finalized', {
      method: 'POST',
      body: JSON.stringify({ winner_wallet: winnerWallet }),
    }),
}
