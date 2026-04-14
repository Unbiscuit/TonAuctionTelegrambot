import { useEffect, useState } from 'react'

type Props = {
  endTime: bigint // unix timestamp в секундах
}

export function Timer({ endTime }: Props) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const update = () => {
      const diff = Number(endTime) - Math.floor(Date.now() / 1000)
      setTimeLeft(Math.max(0, diff))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [endTime])

  const h = Math.floor(timeLeft / 3600)
  const m = Math.floor((timeLeft % 3600) / 60)
  const s = timeLeft % 60

  const pad = (n: number) => String(n).padStart(2, '0')

  if (timeLeft === 0) return <span className="timer timer--ended">Аукцион завершён</span>

  return (
    <span className="timer">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  )
}
