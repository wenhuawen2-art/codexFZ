import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import SnspdCoolingChart from './SnspdCoolingChart'
import { DarkNoiseLegendRows } from './SnspdChartLegend'
import UeLeftGlassPanel from './UeLeftGlassPanel'
import { useDarkNoisePlayback } from '../../hooks/useDarkNoisePlayback'
import type { ConnectionStatus, SceneChartData } from '../../types/dashboard'
import { DARK_NOISE_LINE_COLORS, mergeDarkNoiseChannels, SNSPD_CHART_MARGIN, SNSPD_CHART_TICK, SNSPD_Y_AXIS_WIDTH } from './snspdChartUtils'

interface SnspdLeftPanelProps {
  charts: SceneChartData
  snspdStatus: ConnectionStatus
  onRefreshNoise?: () => void
}

const NOISE_CHANNELS = [1, 2, 3, 4, 5, 6] as const

function SnspdLeftPanel({ charts, snspdStatus, onRefreshNoise }: SnspdLeftPanelProps) {
  const connected = snspdStatus === 'online'
  const { visibleData } = useDarkNoisePlayback(charts.darkNoise, connected)
  const [hiddenChannels, setHiddenChannels] = useState<Record<string, boolean>>({})

  const noiseData = useMemo(() => mergeDarkNoiseChannels(visibleData), [visibleData])

  const toggleChannel = (key: string) => {
    setHiddenChannels((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (!connected) {
    return (
      <UeLeftGlassPanel>
        <p className="flex flex-1 items-center justify-center text-2xs text-hud-muted">未连接</p>
      </UeLeftGlassPanel>
    )
  }

  return (
    <>
      <UeLeftGlassPanel>
        <SnspdCoolingChart curves={charts.snspdCoolingCurves} />
      </UeLeftGlassPanel>

      <UeLeftGlassPanel>
        <div className="mb-1 flex shrink-0 items-center justify-between">
          <p className="text-2xs text-hud-viewport">暗噪声</p>
          <button type="button" className="hud-pill" onClick={onRefreshNoise}>
            刷新
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={noiseData} margin={SNSPD_CHART_MARGIN}>
                <XAxis dataKey="t" tick={SNSPD_CHART_TICK} />
                <YAxis tick={SNSPD_CHART_TICK} width={SNSPD_Y_AXIS_WIDTH} domain={[0, 'auto']} />
                {NOISE_CHANNELS.map((ch, i) => (
                  <Line
                    key={ch}
                    type="monotone"
                    dataKey={`ch${ch}`}
                    name={`通道${ch}`}
                    stroke={DARK_NOISE_LINE_COLORS[i]}
                    hide={hiddenChannels[`ch${ch}`]}
                    dot={false}
                    strokeWidth={1}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <DarkNoiseLegendRows
            channels={NOISE_CHANNELS}
            colors={DARK_NOISE_LINE_COLORS}
            hiddenChannels={hiddenChannels}
            onToggle={toggleChannel}
            className="mt-0.5 shrink-0"
          />
        </div>
      </UeLeftGlassPanel>
    </>
  )
}

export default SnspdLeftPanel
