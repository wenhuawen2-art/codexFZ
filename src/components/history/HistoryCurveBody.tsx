import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import HudButton from '../hud/HudButton'
import HudDateTimePicker from '../controls/HudDateTimePicker'
import HistoryNumericChart from '../viewport/HistoryNumericChart'
import HistorySkylightStrip from '../viewport/HistorySkylightStrip'
import type { HistoryPoint } from '../../types/dashboard'
import {
  ALL_HISTORY_PARAMS,
  getNumericSelection,
} from '../../constants/historyParams'
import HistoryParamStatusIcon from './HistoryParamStatusIcon'
import HistoryParamStatusLegend from './HistoryParamStatusLegend'
import {
  formatNoDataParamLabels,
  getDisplayParams,
  getParamDataStatus,
  getParamDataStatusLabel,
  getExpandedSkylightStripHeight,
  HISTORY_EXPANDED_NUMERIC_MIN_SOLO,
  HISTORY_EXPANDED_NUMERIC_MIN_WITH_SKYLIGHT,
  needsHistoryRequery,
  resolveSkylightLayout,
} from '../viewport/historyChartUtils'

export type HistoryCurveVariant = 'sidebar' | 'chart'

export interface HistoryCurveBodyProps {
  variant: HistoryCurveVariant
  start: string
  end: string
  selected: string[]
  queriedParams: string[]
  data: HistoryPoint[]
  loading: boolean
  queried: boolean
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  onToggleParam: (key: string) => void
  onQuery?: () => void
  onShowResults?: () => void
  showResultsButton?: boolean
  onExportCsv?: () => void
  onClose?: () => void
  className?: string
}

function HistoryCurveBody({
  variant,
  start,
  end,
  selected,
  queriedParams,
  data,
  loading,
  queried,
  onStartChange,
  onEndChange,
  onToggleParam,
  onQuery,
  onShowResults,
  showResultsButton,
  onExportCsv,
  onClose,
  className,
}: HistoryCurveBodyProps) {
  const isChart = variant === 'chart'
  const displayParams = getDisplayParams(selected, queriedParams)
  const numericParams = getNumericSelection(displayParams)
  const hasNumeric = numericParams.length > 0
  const skylightLayout = queried
    ? resolveSkylightLayout(displayParams, data)
    : 'hidden'
  const renderSkylightStrip = skylightLayout === 'strip'
  const showSkylightEmptyHint = skylightLayout === 'empty-hint'
  const needsRequery = needsHistoryRequery(selected, queriedParams)
  const expandedSkylightHeight = getExpandedSkylightStripHeight()
  const expandedNumericMinHeight = renderSkylightStrip
    ? HISTORY_EXPANDED_NUMERIC_MIN_WITH_SKYLIGHT
    : HISTORY_EXPANDED_NUMERIC_MIN_SOLO

  const paramPills = ALL_HISTORY_PARAMS.map((p) => {
    const isSelected = selected.includes(p.key)
    const dataStatus = getParamDataStatus(p.key, queriedParams, data)
    const statusLabel = getParamDataStatusLabel(dataStatus)
    const actionLabel = isSelected ? '点击取消' : '点击选中'

    return (
      <button
        key={p.key}
        type="button"
        title={`${p.pillLabel}：${actionLabel} · ${statusLabel}`}
        onClick={() => onToggleParam(p.key)}
        className={clsx(
          'hud-pill flex w-full items-center gap-1.5 py-0.5 pl-1 pr-1 min-h-[22px]',
          isSelected && 'hud-pill-selected',
        )}
      >
        <span
          className="h-2 w-2 shrink-0"
          style={{ backgroundColor: p.color }}
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate">{p.pillLabel}</span>
        <HistoryParamStatusIcon status={dataStatus} size="compact" />
      </button>
    )
  })

  const selectionHint = (() => {
    if (!isChart || !queried) return null

    if (needsRequery) {
      return (
        <p className="min-w-0 flex-1 text-xs text-hud-highlight">
          勾选已变化，请在左侧栏重新查询
        </p>
      )
    }

    const noDataLabels = formatNoDataParamLabels(queriedParams, data)

    return (
      <p className="min-w-0 flex-1 text-xs text-hud-muted">
        已查 {queriedParams.length} 项
        {noDataLabels.length > 0 && (
          <span>
            {' · 该时间范围无数据项：'}
            {noDataLabels}
          </span>
        )}
      </p>
    )
  })()

  const skylightEmptyHint = (
    <p className="shrink-0 text-xs text-hud-muted">该时间范围无天窗状态数据</p>
  )

  const renderCharts = () => {
    const chartShell = (content: ReactNode) => (
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">{content}</div>
    )

    if (!queried) {
      return (
        <div className="min-h-0 flex-1 border border-dashed border-hud-border/20" />
      )
    }

    if (data.length === 0) {
      return chartShell(
        <p className="flex flex-1 items-center justify-center text-xs text-hud-muted">
          无数据
        </p>,
      )
    }

    if (!hasNumeric && !renderSkylightStrip && !showSkylightEmptyHint) {
      return chartShell(
        <p className="flex flex-1 items-center justify-center text-xs text-hud-muted">
          请选择参数
        </p>,
      )
    }

    return chartShell(
      <>
        {hasNumeric ? (
          <HistoryNumericChart
            chartSize="expanded"
            className="min-h-0 w-full flex-1"
            style={{ minHeight: expandedNumericMinHeight }}
            data={data}
            numericParams={numericParams}
            showXAxis={!renderSkylightStrip}
          />
        ) : renderSkylightStrip ? null : (
          <p
            className="flex flex-1 items-center justify-center text-xs text-hud-muted"
            style={{ minHeight: expandedNumericMinHeight }}
          >
            请选择参数
          </p>
        )}
        {renderSkylightStrip && (
          <HistorySkylightStrip
            chartSize="expanded"
            className={clsx('w-full', hasNumeric ? 'shrink-0' : 'min-h-0 flex-1')}
            style={
              hasNumeric
                ? { height: expandedSkylightHeight }
                : { minHeight: expandedSkylightHeight }
            }
            data={data}
            showXAxis
          />
        )}
        {showSkylightEmptyHint && skylightEmptyHint}
      </>,
    )
  }

  if (isChart) {
    return (
      <div
        className={clsx('flex min-h-0 flex-1 flex-col gap-2 overflow-hidden', className)}
      >
        <div className="flex shrink-0 items-center gap-2">
          {selectionHint ?? <span className="min-w-0 flex-1" />}
          {data.length > 0 && displayParams.length > 0 && onExportCsv && (
            <HudButton className="min-w-[72px] shrink-0 text-xs" onClick={onExportCsv}>
              CSV
            </HudButton>
          )}
          {onClose && (
            <HudButton className="min-w-[72px] shrink-0 text-xs" onClick={onClose}>
              关闭
            </HudButton>
          )}
        </div>
        {renderCharts()}
      </div>
    )
  }

  return (
    <div className={clsx('flex flex-col space-y-1', className)}>
      <HudDateTimePicker
        value={start}
        onChange={onStartChange}
        storageFormat="filter"
        className="h-5 w-full"
      />
      <HudDateTimePicker
        value={end}
        onChange={onEndChange}
        storageFormat="filter"
        className="h-5 w-full"
      />
      <div className="grid grid-cols-1 gap-0.5">{paramPills}</div>
      <HudButton
        variant="active"
        className="w-full"
        onClick={onQuery}
        disabled={loading || selected.length === 0}
      >
        {loading ? (
          <Loader2 className="mx-auto h-3 w-3 animate-spin" aria-hidden />
        ) : (
          '查询'
        )}
      </HudButton>
      {showResultsButton && onShowResults && (
        <HudButton className="w-full" onClick={onShowResults}>
          显示查询结果
        </HudButton>
      )}
      <HistoryParamStatusLegend />
    </div>
  )
}

export default HistoryCurveBody
