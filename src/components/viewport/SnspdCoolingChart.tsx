import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import type { SnspdCoolingCurve } from '../../types/dashboard'
import {
  COOLING_LINE_COLORS,
  mergeCoolingCurves,
  SNSPD_CHART_MARGIN,
  SNSPD_CHART_TICK,
  SNSPD_Y_AXIS_WIDTH,
} from './snspdChartUtils'
import { CoolingLegendRow } from './SnspdChartLegend'

interface SnspdCoolingChartProps {
  curves: SnspdCoolingCurve[]
}

function SnspdCoolingChart({ curves }: SnspdCoolingChartProps) {
  const data = useMemo(() => mergeCoolingCurves(curves), [curves])

  const legendItems = curves.map((curve, i) => ({
    color: COOLING_LINE_COLORS[i],
    label: `制冷器${curve.coolerId}`,
  }))

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-0.5 shrink-0 text-2xs text-hud-viewport">
        制冷温度（K）
      </p>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={SNSPD_CHART_MARGIN}>
              <XAxis dataKey="hours" tick={SNSPD_CHART_TICK} />
              <YAxis
                tick={SNSPD_CHART_TICK}
                width={SNSPD_Y_AXIS_WIDTH}
              />
              {curves.map((curve, i) => (
                <Line
                  key={curve.coolerId}
                  type="monotone"
                  dataKey={`c${curve.coolerId}`}
                  name={`制冷器${curve.coolerId}`}
                  stroke={COOLING_LINE_COLORS[i]}
                  dot={false}
                  strokeWidth={1}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="shrink-0 pr-1 text-right text-[12px] leading-none text-hud-muted">
          时长(h)
        </p>
        <CoolingLegendRow items={legendItems} className="mt-1 shrink-0" />
      </div>
    </div>
  )
}

export default SnspdCoolingChart
