import type { HistoryPoint } from '../../types/dashboard'
import { ALL_HISTORY_PARAMS, hasSkylightSelection } from '../../constants/historyParams'

export type HistoryChartSize = 'compact' | 'expanded'

export type SkylightLayoutMode = 'hidden' | 'strip' | 'empty-hint'

export function hasSkylightData(data: HistoryPoint[]): boolean {
  return data.some((row) => row.skylightStatus != null)
}

export function resolveSkylightLayout(
  displayParams: string[],
  data: HistoryPoint[],
): SkylightLayoutMode {
  if (!hasSkylightSelection(displayParams)) return 'hidden'
  if (!hasSkylightData(data)) return 'empty-hint'
  return 'strip'
}

export function getDisplayParams(selected: string[], queriedParams: string[]): string[] {
  if (queriedParams.length === 0) return []
  return selected.filter((key) => queriedParams.includes(key))
}

export function needsHistoryRequery(selected: string[], queriedParams: string[]): boolean {
  if (queriedParams.length === 0) return false
  if (selected.length !== queriedParams.length) return true
  return selected.some((key) => !queriedParams.includes(key))
}

export type HistoryParamDataStatus = 'unqueried' | 'has-data' | 'no-data'

export const HISTORY_PARAM_DATA_STATUSES: HistoryParamDataStatus[] = [
  'unqueried',
  'has-data',
  'no-data',
]

export function getParamDataStatus(
  key: string,
  queriedParams: string[],
  data: HistoryPoint[],
): HistoryParamDataStatus {
  if (!queriedParams.includes(key)) return 'unqueried'
  if (data.length === 0) return 'no-data'

  const hasField = data.some((row) => {
    if (key === 'skylightStatus') return row.skylightStatus != null
    return row[key as keyof HistoryPoint] != null
  })

  return hasField ? 'has-data' : 'no-data'
}

export function getParamDataStatusLabel(status: HistoryParamDataStatus): string {
  switch (status) {
    case 'unqueried':
      return '未查询'
    case 'has-data':
      return '已查询，有数据'
    case 'no-data':
      return '已查询，无数据'
  }
}

export function getParamDataStatusLegendLabel(status: HistoryParamDataStatus): string {
  switch (status) {
    case 'unqueried':
      return '未查询'
    case 'has-data':
      return '有数据'
    case 'no-data':
      return '无数据'
  }
}

/** 上次查询结果中无数据的参数名称（顿号分隔） */
export function formatNoDataParamLabels(queriedParams: string[], data: HistoryPoint[]): string {
  return ALL_HISTORY_PARAMS.filter(
    (p) => getParamDataStatus(p.key, queriedParams, data) === 'no-data',
  )
    .map((p) => p.pillLabel)
    .join('、')
}

export const HISTORY_CHART_TICK_COMPACT = { fontSize: 10, fill: '#79888d' } as const

export const HISTORY_CHART_TICK_EXPANDED = { fontSize: 12, fill: '#79888d' } as const

export const HISTORY_Y_AXIS_WIDTH_COMPACT = 40

export const HISTORY_Y_AXIS_WIDTH_EXPANDED = 48

export const HISTORY_CHART_MARGIN_COMPACT = {
  top: 4,
  right: 4,
  bottom: 18,
  left: 0,
} as const

export const HISTORY_CHART_MARGIN_EXPANDED = {
  top: 8,
  right: 8,
  bottom: 28,
  left: 0,
} as const

export const HISTORY_X_AXIS_HEIGHT_COMPACT = 16

export const HISTORY_X_AXIS_HEIGHT_EXPANDED = 20

export const HISTORY_SKYLIGHT_MARGIN_COMPACT = {
  top: 8,
  right: 4,
  bottom: 18,
  left: 0,
} as const

export const HISTORY_SKYLIGHT_MARGIN_EXPANDED = {
  top: 10,
  right: 8,
  bottom: 28,
  left: 0,
} as const

export const HISTORY_SKYLIGHT_MARKER_WIDTH_COMPACT = 5

export const HISTORY_SKYLIGHT_MARKER_HEIGHT_COMPACT = 10

export const HISTORY_SKYLIGHT_MARKER_WIDTH_EXPANDED = 12

export const HISTORY_SKYLIGHT_MARKER_HEIGHT_EXPANDED = 22

/** 天窗状态轨固定高度（compact） */
export const HISTORY_SKYLIGHT_STRIP_HEIGHT = 82

/** compact 侧栏数值图最小高度（左侧标题图 78.75px 后下调） */
export const HISTORY_NUMERIC_MIN_HEIGHT_COMPACT = 122

/** expanded 弹层：含天窗时数值图最小高度 */
export const HISTORY_EXPANDED_NUMERIC_MIN_WITH_SKYLIGHT = 280

/** expanded 弹层：仅数值图时最小高度 */
export const HISTORY_EXPANDED_NUMERIC_MIN_SOLO = 360

/** expanded 弹层：天窗状态轨高度 */
export const HISTORY_SKYLIGHT_STRIP_HEIGHT_EXPANDED = 200

export function getHistoryChartTick(size: HistoryChartSize) {
  return size === 'expanded' ? HISTORY_CHART_TICK_EXPANDED : HISTORY_CHART_TICK_COMPACT
}

export function getHistoryYAxisWidth(size: HistoryChartSize) {
  return size === 'expanded' ? HISTORY_Y_AXIS_WIDTH_EXPANDED : HISTORY_Y_AXIS_WIDTH_COMPACT
}

export function getHistoryChartMargin(size: HistoryChartSize) {
  return size === 'expanded' ? HISTORY_CHART_MARGIN_EXPANDED : HISTORY_CHART_MARGIN_COMPACT
}

export function getHistoryXAxisHeight(size: HistoryChartSize) {
  return size === 'expanded' ? HISTORY_X_AXIS_HEIGHT_EXPANDED : HISTORY_X_AXIS_HEIGHT_COMPACT
}

export function getHistorySkylightMargin(size: HistoryChartSize) {
  return size === 'expanded' ? HISTORY_SKYLIGHT_MARGIN_EXPANDED : HISTORY_SKYLIGHT_MARGIN_COMPACT
}

export function getHistorySkylightMarkerSize(size: HistoryChartSize) {
  return size === 'expanded'
    ? {
        width: HISTORY_SKYLIGHT_MARKER_WIDTH_EXPANDED,
        height: HISTORY_SKYLIGHT_MARKER_HEIGHT_EXPANDED,
      }
    : {
        width: HISTORY_SKYLIGHT_MARKER_WIDTH_COMPACT,
        height: HISTORY_SKYLIGHT_MARKER_HEIGHT_COMPACT,
      }
}

export function getExpandedSkylightStripHeight(): number {
  return HISTORY_SKYLIGHT_STRIP_HEIGHT_EXPANDED
}
