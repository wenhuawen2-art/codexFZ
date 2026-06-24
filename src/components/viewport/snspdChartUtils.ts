import type { DarkNoiseChannelData } from '../../hooks/useDarkNoisePlayback'
import type { SnspdCoolingCurve } from '../../types/dashboard'

export const COOLING_LINE_COLORS = ['#11e99d', '#78c4e3', '#fbc56a'] as const

export const DARK_NOISE_LINE_COLORS = [
  '#11e99d',
  '#78c4e3',
  '#fb992e',
  '#fbc56a',
  '#e46515',
  '#6bd3ed',
] as const

export const SNSPD_CHART_TICK = { fontSize: 10, fill: '#79888d' } as const

export const SNSPD_AXIS_LABEL = { fontSize: 10, fill: '#79888d' } as const

export const SNSPD_CHART_MARGIN = { top: 4, right: 4, bottom: 2, left: 8 } as const

export const SNSPD_Y_AXIS_WIDTH = 30

export function mergeCoolingCurves(curves: SnspdCoolingCurve[]) {
  const maxLen = Math.max(...curves.map((c) => c.points.length), 0)
  return Array.from({ length: maxLen }, (_, i) => {
    const row: Record<string, number> = { hours: curves[0]?.points[i]?.hours ?? i }
    curves.forEach((curve) => {
      const point = curve.points[i]
      if (point) row[`c${curve.coolerId}`] = point.tempK
    })
    return row
  })
}

export function mergeDarkNoiseChannels(channels: DarkNoiseChannelData[]) {
  const len = channels[0]?.points.length ?? 0
  return Array.from({ length: len }, (_, t) => {
    const row: Record<string, number> = { t }
    channels.forEach((ch) => {
      const point = ch.points[t]
      if (point) row[`ch${ch.channel}`] = point.v
    })
    return row
  })
}
