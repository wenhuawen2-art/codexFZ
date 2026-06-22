import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { colors } from '../styles/colors'

export interface IntensityPoint {
  time: string
  intensity: number
  distance: number
}

interface RadarChartProps {
  data: IntensityPoint[]
  compact?: boolean
}

function RadarChart({ data, compact }: RadarChartProps) {
  return (
    <div>
      {!compact && (
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-2xs uppercase tracking-widest text-hud-viewport">
            Intensity Trend
          </h2>
        </div>
      )}
      <div className={compact ? 'h-36' : 'h-48'}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="2 2"
              stroke={colors.gridMinor}
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: colors.muted, fontSize: 9 }}
              axisLine={{ stroke: colors.gridMinor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: colors.muted, fontSize: 9 }}
              axisLine={{ stroke: colors.gridMinor }}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 0,
                fontSize: '10px',
                fontFamily: 'Consolas, monospace',
              }}
              labelStyle={{ color: colors.muted }}
              itemStyle={{ color: colors.gridCross }}
            />
            <Area
              type="monotone"
              dataKey="intensity"
              stroke={colors.gridCross}
              strokeWidth={1}
              fill={colors.gridCross}
              fillOpacity={0.15}
              name="INT"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RadarChart
