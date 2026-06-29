import type { LogCategory, LogEventLevel, LogEventType, UploadStatus } from '../types/logs'

export const LOG_CATEGORY_LABELS: Record<LogCategory, string> = {
  operation: '操作日志',
  exception: '异常事件',
  dataFile: '数据文件',
  upload: '上传任务',
  export: '导出记录',
}

export const LOG_EVENT_TYPE_LABELS: Record<LogEventType, string> = {
  power: '开关机',
  param: '参数设置',
  control: '控制操作',
  exception: '异常事件',
  upload: '上传事件',
  export: '导出',
  user: '用户行为',
}

export const LOG_EVENT_LEVEL_LABELS: Record<LogEventLevel, string> = {
  info: '提示',
  normal: '一般',
  severe: '严重',
  critical: '紧急',
}

export const UPLOAD_STATUS_LABELS: Record<UploadStatus, string> = {
  pending: '待上传',
  uploading: '上传中',
  success: '上传成功',
  failed: '上传失败',
  cancelled: '已取消',
  missing: '文件缺失',
}

export const UPLOAD_STATUS_VARIANT: Record<
  UploadStatus,
  'online' | 'offline' | 'simulated' | 'alert'
> = {
  pending: 'offline',
  uploading: 'simulated',
  success: 'online',
  failed: 'alert',
  cancelled: 'offline',
  missing: 'alert',
}

export const LOG_LEVEL_VARIANT: Record<
  LogEventLevel,
  'online' | 'offline' | 'simulated' | 'alert'
> = {
  info: 'offline',
  normal: 'online',
  severe: 'simulated',
  critical: 'alert',
}

export const LOG_DEVICE_OPTIONS = [
  { value: '', label: '全部设备' },
  { value: '激光系统', label: '激光系统' },
  { value: '望远镜阵列', label: '望远镜阵列' },
  { value: '天窗', label: '天窗' },
  { value: 'CCD', label: 'CCD' },
  { value: '超导探测器', label: '超导探测器' },
  { value: '系统服务', label: '系统服务' },
]

export const LOG_EVENT_TYPE_OPTIONS = [
  { value: '', label: '全部类型' },
  ...Object.entries(LOG_EVENT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
]

export const LOG_LEVEL_OPTIONS = [
  { value: '', label: '全部等级' },
  ...Object.entries(LOG_EVENT_LEVEL_LABELS).map(([value, label]) => ({ value, label })),
]

export const LOG_PAGE_SIZE = 8

export type LogStatKey = 'todayOperations' | 'todayExceptions' | 'pendingUploads' | 'failedUploads'

export const LOG_STAT_CARDS: {
  key: LogStatKey
  label: string
  category?: LogCategory
  uploadPreset?: import('../types/logs').UploadStatPreset
}[] = [
  { key: 'todayOperations', label: '今日操作', category: 'operation' },
  { key: 'todayExceptions', label: '今日异常', category: 'exception' },
  { key: 'pendingUploads', label: '待上传', category: 'upload', uploadPreset: 'pending' },
  { key: 'failedUploads', label: '上传失败', category: 'upload', uploadPreset: 'failed' },
]

export const UPLOAD_LOG_TYPE_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: '采集数据', label: '采集数据' },
  { value: '操作日志', label: '操作日志' },
]

export const UPLOAD_STATUS_FILTER_OPTIONS = [
  { value: '', label: '全部状态' },
  ...Object.entries(UPLOAD_STATUS_LABELS).map(([value, label]) => ({ value, label })),
]
