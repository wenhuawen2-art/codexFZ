import { useEffect, useMemo, useState } from 'react'
import type { SceneChartData } from '../types/dashboard'

const FRAME_INTERVAL_MS = 200

export interface DarkNoiseChannelData {
  channel: number
  points: { t: number; v: number }[]
}

export function useDarkNoisePlayback(
  darkNoise: SceneChartData['darkNoise'],
  active: boolean,
) {
  const [frameIndex, setFrameIndex] = useState(0)
  const maxIndex = darkNoise[0]?.values.length ?? 0

  useEffect(() => {
    setFrameIndex(0)
  }, [darkNoise])

  useEffect(() => {
    if (!active || maxIndex <= 1) return
    if (frameIndex >= maxIndex - 1) return

    const id = window.setInterval(() => {
      setFrameIndex((current) => Math.min(current + 1, maxIndex - 1))
    }, FRAME_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [active, frameIndex, maxIndex])

  const visibleData = useMemo<DarkNoiseChannelData[]>(
    () =>
      darkNoise.map((ch) => ({
        channel: ch.channel,
        points: ch.values.slice(0, frameIndex + 1).map((v, t) => ({ t, v })),
      })),
    [darkNoise, frameIndex],
  )

  return { visibleData, frameIndex }
}
