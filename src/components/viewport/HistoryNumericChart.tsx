import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import clsx from 'clsx'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { HistoryPoint } from '../../types/dashboard'
import {
  buildChartData,
  formatNumericValue,
  getLineDataKey,
  getYAxisId,
  resolveDualAxisAssignment,
  resolveYAxisMode,
  type NumericHistoryParam,
} from '../../constants/historyParams'
import {
  getHistoryChartMargin,
  getHistoryChartTick,
  getHistoryXAxisHeight,
  getHistoryYAxisWidth,
  type HistoryChartSize,
} from './historyChartUtils'

interface HistoryNumericChartProps {
  data: HistoryPoint[]
  numericParams: NumericHistoryParam[]
  chartSize?: HistoryChartSize
  className?: string
  style?: CSSProperties
  showXAxis?: boolean
}

interface NumericTooltipProps extends TooltipProps<number, string> {
  numericParams: NumericHistoryParam[]
  mode: ReturnType<typeof resolveYAxisMode>
  chartSize: HistoryChartSize
}

function NumericTooltip({
  active,
  payload,
  label,
  numericParams,
  mode,
  chartSize,
}: NumericTooltipProps) {
  if (!active || !payload?.length) return null

  const textClass = chartSize === 'expanded' ? 'text-xs' : 'text-[10px]'

  return (
    <div className="border border-hud-viewport/40 bg-hud-card px-2 py-1 shadow-none">
      <p className={clsx('mb-0.5 leading-tight text-hud-muted', textClass)}>{label}</p>
      <div className="space-y-0.5">
        {numericParams.map((param) => {
          const entry = payload.find((item) => item.name === param.chartLabel)
          const rawValue =
            mode === 'normalized'
              ? entry?.payload?.[`${param.key}__raw`]
              : entry?.value
          return (
            <p
              key={param.key}
              className={clsx('truncate leading-tight', textClass)}
              style={{ color: param.color }}
            >
              {param.chartLabel}: {formatNumericValue(rawValue, param.unit)}
            </p>
          )
        })}
      </div>
    </div>
  )
}

function HistoryNumericChart({
  data,
  numericParams,
  chartSize = 'compact',
  className,
  style,
  showXAxis = false,
}: HistoryNumericChartProps) {
  const mode = resolveYAxisMode(numericParams)
  const dualAssignment = resolveDualAxisAssignment(numericParams)
  const chartData = useMemo(
    () => buildChartData(data, numericParams, mode),
    [data, numericParams, mode],
  )
  const tick = getHistoryChartTick(chartSize)
  const yAxisWidth = getHistoryYAxisWidth(chartSize)
  const xAxisHeight = getHistoryXAxisHeight(chartSize)

  if (numericParams.length === 0) return null

  const margin = {
    ...getHistoryChartMargin(chartSize),
    right: mode === 'dual' ? 10 : getHistoryChartMargin(chartSize).right,
    bottom: showXAxis ? getHistoryChartMargin(chartSize).bottom : 4,
  }

  return (
    <div className={clsx('w-full', className)} style={style}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={margin}>
          <XAxis
            dataKey="time"
            tick={tick}
            hide={!showXAxis}
            height={showXAxis ? xAxisHeight : 0}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={tick}
            width={yAxisWidth}
            domain={mode === 'normalized' ? [0, 100] : ['auto', 'auto']}
            tickFormatter={
              mode === 'normalized'
                ? (v) => (v === 0 || v === 100 ? String(v) : '')
                : undefined
            }
          />
          {mode === 'dual' && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={tick}
              width={yAxisWidth}
              domain={['auto', 'auto']}
            />
          )}
          <Tooltip
            content={
              <NumericTooltip
                numericParams={numericParams}
                mode={mode}
                chartSize={chartSize}
              />
            }
          />
          {numericParams.map((param) => (
            <Line
              key={param.key}
              yAxisId={getYAxisId(param, mode, dualAssignment)}
              type="monotone"
              dataKey={getLineDataKey(param, mode)}
              name={param.chartLabel}
              stroke={param.color}
              dot={false}
              strokeWidth={chartSize === 'expanded' ? 2 : 1.5}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HistoryNumericChart
