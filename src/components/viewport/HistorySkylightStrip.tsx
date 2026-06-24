import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import clsx from 'clsx'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { HistoryPoint } from '../../types/dashboard'
import {
  mapSkylightToOrdinal,
  ordinalToLabel,
  SKYLIGHT_STATUS_COLORS,
} from '../../constants/historyParams'
import {
  getHistoryChartTick,
  getHistorySkylightMargin,
  getHistorySkylightMarkerSize,
  getHistoryXAxisHeight,
  getHistoryYAxisWidth,
  type HistoryChartSize,
} from './historyChartUtils'

interface SkylightRow {
  time: string
  ordinal: number
  status: NonNullable<HistoryPoint['skylightStatus']>
  label: string
}

interface HistorySkylightStripProps {
  data: HistoryPoint[]
  chartSize?: HistoryChartSize
  className?: string
  style?: CSSProperties
  showXAxis?: boolean
}

function createSkylightMarker(size: HistoryChartSize) {
  const { width, height } = getHistorySkylightMarkerSize(size)

  function SkylightMarker({
    cx = 0,
    cy = 0,
    fill = '#79888d',
  }: {
    cx?: number
    cy?: number
    fill?: string
  }) {
    return (
      <rect
        x={cx - width / 2}
        y={cy - height / 2}
        width={width}
        height={height}
        fill={fill}
      />
    )
  }

  return SkylightMarker
}

function SkylightTooltip({
  active,
  payload,
  chartSize,
}: TooltipProps<number, string> & { chartSize: HistoryChartSize }) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload as SkylightRow | undefined
  if (!row) return null

  const textClass = chartSize === 'expanded' ? 'text-xs' : 'text-[10px]'

  return (
    <div className="border border-hud-viewport/40 bg-hud-card px-2 py-1 shadow-none">
      <p className={clsx('leading-tight text-hud-muted', textClass)}>
        {row.time}
      </p>
      <p
        className={clsx('leading-tight', textClass)}
        style={{ color: SKYLIGHT_STATUS_COLORS[row.status] }}
      >
        天窗状态: {row.label}
      </p>
    </div>
  )
}

function HistorySkylightStrip({
  data,
  chartSize = 'compact',
  className,
  style,
  showXAxis = true,
}: HistorySkylightStripProps) {
  const stripData = useMemo<SkylightRow[]>(
    () =>
      data
        .filter((row) => row.skylightStatus != null)
        .map((row) => ({
          time: row.time,
          ordinal: mapSkylightToOrdinal(row.skylightStatus!),
          status: row.skylightStatus!,
          label: ordinalToLabel(mapSkylightToOrdinal(row.skylightStatus!)),
        })),
    [data],
  )

  const tick = getHistoryChartTick(chartSize)
  const yAxisWidth = getHistoryYAxisWidth(chartSize)
  const xAxisHeight = getHistoryXAxisHeight(chartSize)
  const SkylightMarker = useMemo(
    () => createSkylightMarker(chartSize),
    [chartSize],
  )

  if (stripData.length === 0) return null

  return (
    <div className={clsx('w-full', className)} style={style}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={getHistorySkylightMargin(chartSize)}>
          <XAxis
            type="category"
            dataKey="time"
            tick={tick}
            hide={!showXAxis}
            height={showXAxis ? xAxisHeight : 0}
            interval="preserveStartEnd"
            minTickGap={24}
            allowDuplicatedCategory={false}
          />
          <YAxis
            type="number"
            dataKey="ordinal"
            domain={[-0.5, 3.5]}
            ticks={[0, 1, 2, 3]}
            tickFormatter={ordinalToLabel}
            tick={tick}
            width={yAxisWidth}
            interval={0}
          />
          <Tooltip content={<SkylightTooltip chartSize={chartSize} />} />
          <Scatter data={stripData} shape={SkylightMarker}>
            {stripData.map((row) => (
              <Cell
                key={`${row.time}-${row.status}`}
                fill={SKYLIGHT_STATUS_COLORS[row.status]}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HistorySkylightStrip
