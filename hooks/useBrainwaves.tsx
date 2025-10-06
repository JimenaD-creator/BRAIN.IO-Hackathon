import { useState, useEffect } from "react"

export type BrainwaveData = {
  delta: number
  theta: number
  alpha: number
  beta: number
  gamma: number
  concentration: number
}

export function useBrainwaves(isConnected: boolean) {
  const [data, setData] = useState<BrainwaveData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected) return
    let active = true

    const fetchData = async () => {
      try {
        const response = await fetch("http://10.43.85.125:8000/brainwaves")
        const json = await response.json()
        if (active && json && typeof json.delta === "number") {
          setData(json)
          setError(null)
        }
      } catch (err) {
        console.error("EEG fetch error:", err)
        setError("Connection error — using simulated data")
        // fallback demo data
        setData({
          delta: 1.0,
          theta: 1.2,
          alpha: 2.0,
          beta: 2.3,
          gamma: 0.9,
          concentration: 0.6,
        })
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [isConnected])

  return { data, error }
}
