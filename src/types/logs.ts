import type { OperationLog } from './dashboard'

export type LogCategory = 'operation' | 'exception' | 'dataFile' | 'upload' | 'export'

export type LogEventType =
  | 'power'
  | 'param'
  | 'control'
  | 'exception'
  | 'upload'
  | 'export'
  | 'user'

export type LogEventLevel = 'info' | 'normal' | 'severe' | 'critical'

export type UploadStatus =
  | 'pending'
  | 'uploading'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'missing'

export interface ExceptionLog {
  id: string
  timestamp: string
  level: LogEventLevel
  source: string
  deviceName: string
  content: string
  status: 'open' | 'resolved'
  handler?: string
  remark?: string
}

export interface DataFile {
  id: string
  fileName: string
  observeTime: string
  fileSize: string
  dataType: string
  storagePath: string
  generateStatus: 'ready' | 'processing' | 'failed'
  uploadStatus: UploadStatus
  failureReason?: string
}

export interface UploadTask {
  id: string
  timestamp: string
  fileName: string
  timeRange: string
  logType: string
  uploadStatus: UploadStatus
  progress?: number
  failureReason?: string
  completedAt?: string
}

export interface ExportRecord {
  id: string
  timestamp: string
  user: string
  category: LogCategory
  filterSummary: string
  rowCount: number
  format: 'csv' | 'xlsx'
  result: 'success' | 'failure'
}

export interface LogStats {
  todayOperations: number
  todayExceptions: number
  pendingUploads: number
  failedUploads: number
  lastUploadTime: string
}

export interface LogsPageData {
  stats: LogStats
  operationLogs: OperationLog[]
  exceptionLogs: ExceptionLog[]
  dataFiles: DataFile[]
  uploadTasks: UploadTask[]
  exportRecords: ExportRecord[]
}

export type LogListItem =
  | { category: 'operation'; data: OperationLog }
  | { category: 'exception'; data: ExceptionLog }
  | { category: 'dataFile'; data: DataFile }
  | { category: 'upload'; data: UploadTask }
  | { category: 'export'; data: ExportRecord }

export interface LogFilters {
  start: string
  end: string
  device: string
  eventType: string
  level: string
  keyword: string
  uploadStatus: string
  uploadLogType: string
}

export type UploadStatPreset = 'pending' | 'failed' | 'recent'

export type StatClickAction =
  | { type: 'category'; category: LogCategory }
  | { type: 'uploadPreset'; preset: UploadStatPreset }
