import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const DISPLAY_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

const FILTER_STORAGE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
const PARAM_STORAGE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

const PARSE_FORMATS = [
  DISPLAY_DATETIME_FORMAT,
  'YYYY-MM-DDTHH:mm:ss',
  FILTER_STORAGE_FORMAT,
  'YYYY-MM-DD HH:mm',
]

export function parseDateTimeValue(value: string | undefined): Date | null {
  if (!value?.trim()) return null
  for (const fmt of PARSE_FORMATS) {
    const parsed = dayjs(value, fmt, true)
    if (parsed.isValid()) return parsed.toDate()
  }
  const fallback = dayjs(value)
  return fallback.isValid() ? fallback.toDate() : null
}

export function formatDateTimeDisplay(date: Date | null): string {
  if (!date) return '—'
  return dayjs(date).format(DISPLAY_DATETIME_FORMAT)
}

export function fromDateToStorage(date: Date, mode: 'filter' | 'param'): string {
  if (mode === 'filter') return dayjs(date).format(FILTER_STORAGE_FORMAT)
  return dayjs(date).format(PARAM_STORAGE_FORMAT)
}

export function toFilterDateTime(value: string): string {
  const parsed = parseDateTimeValue(value)
  return parsed ? fromDateToStorage(parsed, 'filter') : value
}

export function toParamDateTime(value: string): string {
  const parsed = parseDateTimeValue(value)
  return parsed ? fromDateToStorage(parsed, 'param') : value
}
