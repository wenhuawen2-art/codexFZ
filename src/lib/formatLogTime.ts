import dayjs from 'dayjs'
import type { UploadTask } from '../types/logs'

export const LOG_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function formatLogTime(iso: string | undefined): string {
  if (!iso) return '—'
  const parsed = dayjs(iso)
  if (!parsed.isValid()) return '—'
  return parsed.format(LOG_TIME_FORMAT)
}

export function getUploadSortTime(task: UploadTask): string {
  return task.completedAt ?? task.timestamp
}
