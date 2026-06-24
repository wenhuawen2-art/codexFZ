import type { HistoryPoint, SkylightStatus } from '../types/dashboard'
import { SKYLIGHT_LABELS } from './labels'

export type HistoryAxisGroup =
  | 'wavelength'
  | 'frequency'
  | 'distance'
  | 'count'
  | 'duration'

export type NumericHistoryParamKey =
  | 'wavelengthNm'
  | 'heightResolutionM'
  | 'prfHz'
  | 'rawAccumulation'
  | 'accumulatedTimeSec'

export interface NumericHistoryParam {
  key: NumericHistoryParamKey
  pillLabel: string
  chartLabel: string
  color: string
  unit: string
  axisGroup: HistoryAxisGroup
}

export interface StateHistoryParam {
  key: 'skylightStatus'
  pillLabel: string
  chartLabel: string
  color: string
}

export const NUMERIC_HISTORY_PARAMS: NumericHistoryParam[] = [
  {
    key: 'wavelengthNm',
    pillLabel: '激光波长',
    chartLabel: '激光波长',
    color: '#11e99d',
    unit: 'nm',
    axisGroup: 'wavelength',
  },
  {
    key: 'heightResolutionM',
    pillLabel: '高度分辨率',
    chartLabel: '高度分辨率',
    color: '#78c4e3',
    unit: 'm',
    axisGroup: 'distance',
  },
  {
    key: 'prfHz',
    pillLabel: '脉冲重复频率',
    chartLabel: '脉冲重复频率',
    color: '#fb992e',
    unit: 'Hz',
    axisGroup: 'frequency',
  },
  {
    key: 'rawAccumulation',
    pillLabel: '原始积累数',
    chartLabel: '原始积累数',
    color: '#c4a7e7',
    unit: '',
    axisGroup: 'count',
  },
  {
    key: 'accumulatedTimeSec',
    pillLabel: '累计时间',
    chartLabel: '累计时间',
    color: '#fbc56a',
    unit: 's',
    axisGroup: 'duration',
  },
]

export const STATE_HISTORY_PARAMS: StateHistoryParam[] = [
  {
    key: 'skylightStatus',
    pillLabel: '天窗状态',
    chartLabel: '天窗状态',
    color: '#6bd3ed',
  },
]

export const ALL_HISTORY_PARAMS = [...NUMERIC_HISTORY_PARAMS, ...STATE_HISTORY_PARAMS]

export type YAxisMode = 'single' | 'dual' | 'normalized'

export type ChartRow = HistoryPoint & Record<string, number | string | undefined>

export function getNumericSelection(selected: string[]): NumericHistoryParam[] {
  return NUMERIC_HISTORY_PARAMS.filter((p) => selected.includes(p.key))
}

export function hasSkylightSelection(selected: string[]): boolean {
  return selected.includes('skylightStatus')
}

export function resolveYAxisMode(numericParams: NumericHistoryParam[]): YAxisMode {
  if (numericParams.length >= 3) return 'normalized'
  if (numericParams.length <= 1) return 'single'

  const groups = new Set(numericParams.map((p) => p.axisGroup))
  return groups.size >= 2 ? 'dual' : 'single'
}

export function resolveDualAxisAssignment(
  numericParams: NumericHistoryParam[],
): Map<HistoryAxisGroup, 'left' | 'right'> {
  const map = new Map<HistoryAxisGroup, 'left' | 'right'>()
  for (const param of numericParams) {
    if (!map.has(param.axisGroup)) {
      map.set(param.axisGroup, map.size === 0 ? 'left' : 'right')
    }
  }
  return map
}

export function buildChartData(
  data: HistoryPoint[],
  numericParams: NumericHistoryParam[],
  mode: YAxisMode,
): ChartRow[] {
  if (mode !== 'normalized') return data as ChartRow[]

  const ranges = new Map<NumericHistoryParamKey, { min: number; max: number }>()
  for (const param of numericParams) {
    const values = data
      .map((row) => row[param.key])
      .filter((v): v is number => typeof v === 'number')
    if (values.length === 0) continue
    ranges.set(param.key, { min: Math.min(...values), max: Math.max(...values) })
  }

  return data.map((row) => {
    const enriched: ChartRow = { ...row }
    for (const param of numericParams) {
      const raw = row[param.key]
      const range = ranges.get(param.key)
      if (typeof raw !== 'number' || !range) continue
      enriched[`${param.key}__norm`] =
        ((raw - range.min) / (range.max - range.min || 1)) * 100
      enriched[`${param.key}__raw`] = raw
    }
    return enriched
  })
}

export function getLineDataKey(param: NumericHistoryParam, mode: YAxisMode): string {
  return mode === 'normalized' ? `${param.key}__norm` : param.key
}

export function getYAxisId(
  param: NumericHistoryParam,
  mode: YAxisMode,
  dualAssignment: Map<HistoryAxisGroup, 'left' | 'right'>,
): string {
  if (mode === 'dual') return dualAssignment.get(param.axisGroup) ?? 'left'
  return 'left'
}

export function formatNumericValue(value: unknown, unit: string): string {
  if (value == null) return '--'
  const num = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(num)) return String(value)
  const formatted =
    Number.isInteger(num) || Math.abs(num) >= 100 ? String(Math.round(num * 100) / 100) : num.toFixed(2)
  return unit ? `${formatted} ${unit}` : formatted
}

export const SKYLIGHT_STATUS_COLORS: Record<SkylightStatus, string> = {
  closed: '#79888d',
  open: '#11e99d',
  executing: '#fb992e',
  fault: '#f42b26',
}

export const SKYLIGHT_ORDINALS: SkylightStatus[] = [
  'closed',
  'open',
  'executing',
  'fault',
]

export function mapSkylightToOrdinal(status: SkylightStatus): number {
  const index = SKYLIGHT_ORDINALS.indexOf(status)
  return index >= 0 ? index : 0
}

export function ordinalToLabel(ordinal: number): string {
  const status = SKYLIGHT_ORDINALS[ordinal]
  return status ? SKYLIGHT_LABELS[status] : ''
}

export function formatHistoryCsvValue(key: string, row: HistoryPoint): string {
  if (key === 'skylightStatus' && row.skylightStatus) {
    return SKYLIGHT_LABELS[row.skylightStatus] ?? row.skylightStatus
  }
  const value = row[key as keyof HistoryPoint]
  return value == null ? '' : String(value)
}
