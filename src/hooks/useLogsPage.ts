import { useCallback, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { LOG_CATEGORY_LABELS, LOG_EVENT_TYPE_LABELS, LOG_PAGE_SIZE } from '../constants/logs'
import { downloadCsv, escapeCsvCell } from '../lib/csv'
import { formatLogTime, getUploadSortTime } from '../lib/formatLogTime'
import { cloneLogsPageData, createLogsPageData } from '../mocks/logs'
import type { OperationLog } from '../types/dashboard'
import type {
  LogCategory,
  LogFilters,
  LogListItem,
  LogsPageData,
  StatClickAction,
  UploadStatPreset,
  UploadTask,
} from '../types/logs'

function defaultFilters(): LogFilters {
  return {
    start: dayjs().subtract(7, 'day').format('YYYY-MM-DDTHH:mm:ss'),
    end: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    device: '',
    eventType: '',
    level: '',
    keyword: '',
    uploadStatus: '',
    uploadLogType: '',
  }
}

function filtersForUploadPreset(preset: UploadStatPreset): LogFilters {
  const base = defaultFilters()
  if (preset === 'pending') return { ...base, uploadStatus: 'pending' }
  if (preset === 'failed') return { ...base, uploadStatus: 'failed' }
  return base
}

function inTimeRange(ts: string, start: string, end: string) {
  const t = dayjs(ts)
  return !t.isBefore(dayjs(start)) && !t.isAfter(dayjs(end))
}

function matchesKeyword(text: string, keyword: string) {
  if (!keyword.trim()) return true
  return text.toLowerCase().includes(keyword.trim().toLowerCase())
}

function toListItems(data: LogsPageData, category: LogCategory): LogListItem[] {
  switch (category) {
    case 'operation':
      return data.operationLogs.map((row) => ({ category, data: row }))
    case 'exception':
      return data.exceptionLogs.map((row) => ({ category, data: row }))
    case 'dataFile':
      return data.dataFiles.map((row) => ({ category, data: row }))
    case 'upload':
      return data.uploadTasks.map((row) => ({ category, data: row }))
    case 'export':
      return data.exportRecords.map((row) => ({ category, data: row }))
  }
}

function filterItems(items: LogListItem[], filters: LogFilters): LogListItem[] {
  return items.filter((item) => {
    const { category, data } = item

    if (category === 'operation') {
      if (filters.device && !data.deviceName.includes(filters.device)) return false
      if (filters.eventType && data.eventType !== filters.eventType) return false
      if (!inTimeRange(data.timestamp, filters.start, filters.end)) return false
      return matchesKeyword(
        `${data.deviceName} ${data.content} ${data.user}`,
        filters.keyword,
      )
    }

    if (category === 'exception') {
      if (filters.device && !data.deviceName.includes(filters.device)) return false
      if (filters.level && data.level !== filters.level) return false
      if (!inTimeRange(data.timestamp, filters.start, filters.end)) return false
      return matchesKeyword(`${data.deviceName} ${data.content}`, filters.keyword)
    }

    if (category === 'dataFile') {
      if (!inTimeRange(data.observeTime, filters.start, filters.end)) return false
      return matchesKeyword(`${data.fileName} ${data.dataType}`, filters.keyword)
    }

    if (category === 'upload') {
      if (filters.uploadStatus && data.uploadStatus !== filters.uploadStatus) return false
      if (filters.uploadLogType && data.logType !== filters.uploadLogType) return false
      if (!inTimeRange(data.timestamp, filters.start, filters.end)) return false
      return matchesKeyword(`${data.fileName} ${data.logType}`, filters.keyword)
    }

    if (!inTimeRange(data.timestamp, filters.start, filters.end)) return false
    return matchesKeyword(`${data.user} ${data.filterSummary}`, filters.keyword)
  })
}

function sortItems(items: LogListItem[], desc: boolean): LogListItem[] {
  const getTime = (item: LogListItem) => {
    if (item.category === 'dataFile') return item.data.observeTime
    if (item.category === 'upload') return getUploadSortTime(item.data)
    return item.data.timestamp
  }
  return [...items].sort((a, b) => {
    const av = getTime(a)
    const bv = getTime(b)
    return desc ? bv.localeCompare(av) : av.localeCompare(bv)
  })
}

function exportItems(items: LogListItem[]) {
  if (items.length === 0) return
  const category = items[0].category

  if (category === 'operation') {
    const headers = [
      '时间',
      '用户',
      '设备',
      '类型',
      '内容',
      '参数名',
      '变更前',
      '变更后',
      '单位',
      '结果',
      '失败原因',
      'IP',
      '终端',
    ]
    const rows = items.map(({ data }) => {
      const d = data as OperationLog
      const typeLabel = LOG_EVENT_TYPE_LABELS[d.eventType]
      return headers.map((_, i) =>
        escapeCsvCell(
          [
            formatLogTime(d.timestamp),
            d.user,
            d.deviceName,
            typeLabel,
            d.content,
            d.paramName ?? '',
            d.oldValue,
            d.newValue,
            d.unit ?? '',
            d.result === 'success' ? '成功' : '失败',
            d.failureReason ?? '',
            d.clientIp ?? '',
            d.terminal ?? '',
          ][i],
        ),
      )
    })
    downloadCsv(headers, rows, 'operation_logs')
    return
  }

  if (category === 'exception') {
    const headers = ['时间', '等级', '来源', '设备', '内容', '状态', '处理人', '处理备注']
    const rows = items.map(({ data }) => {
      const d = data as import('../types/logs').ExceptionLog
      return headers.map((_, i) =>
        escapeCsvCell(
          [
            formatLogTime(d.timestamp),
            d.level,
            d.source,
            d.deviceName,
            d.content,
            d.status,
            d.handler ?? '',
            d.remark ?? '',
          ][i],
        ),
      )
    })
    downloadCsv(headers, rows, 'exception_logs')
    return
  }

  if (category === 'upload') {
    const headers = ['时间', '文件名', '时间范围', '类型', '状态', '失败原因']
    const rows = items.map(({ data }) => {
      const d = data as UploadTask
      return headers.map((_, i) =>
        escapeCsvCell(
          [
            formatLogTime(d.timestamp),
            d.fileName,
            d.timeRange,
            d.logType,
            d.uploadStatus,
            d.failureReason ?? '',
          ][i],
        ),
      )
    })
    downloadCsv(headers, rows, 'upload_tasks')
  }
}

export function useLogsPage() {
  const [pageData, setPageData] = useState(() => createLogsPageData())
  const [category, setCategory] = useState<LogCategory>('operation')
  const [filters, setFilters] = useState(defaultFilters)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(1)
  const [activeUploadPreset, setActiveUploadPreset] = useState<UploadStatPreset | null>(null)

  const allItems = useMemo(() => toListItems(pageData, category), [pageData, category])
  const filteredItems = useMemo(
    () => sortItems(filterItems(allItems, filters), sortDesc),
    [allItems, filters, sortDesc],
  )
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / LOG_PAGE_SIZE))
  const pageItems = useMemo(() => {
    const start = (page - 1) * LOG_PAGE_SIZE
    return filteredItems.slice(start, start + LOG_PAGE_SIZE)
  }, [filteredItems, page])

  const selectedItem = useMemo(
    () => filteredItems.find((item) => item.data.id === selectedId) ?? null,
    [filteredItems, selectedId],
  )

  const handleCategoryChange = useCallback((next: LogCategory) => {
    setCategory(next)
    setActiveUploadPreset(null)
    setSelectedId(null)
    setPage(1)
  }, [])

  const applyStatClick = useCallback((action: StatClickAction) => {
    if (action.type === 'category') {
      setCategory(action.category)
      setActiveUploadPreset(null)
      setFilters(defaultFilters())
      setSelectedId(null)
      setPage(1)
      return
    }

    setCategory('upload')
    setActiveUploadPreset(action.preset)
    setFilters(filtersForUploadPreset(action.preset))
    if (action.preset === 'recent') {
      setSortDesc(true)
    }
    setSelectedId(null)
    setPage(1)
  }, [])

  const handleFiltersChange = useCallback((patch: Partial<LogFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
    if ('uploadStatus' in patch || 'uploadLogType' in patch) {
      setActiveUploadPreset(null)
    }
    setPage(1)
  }, [])

  const handleRefresh = useCallback(() => {
    setPageData(cloneLogsPageData(createLogsPageData()))
    setSelectedId(null)
    setPage(1)
  }, [])

  const updateUploadTask = useCallback((id: string, patch: Partial<UploadTask>) => {
    setPageData((prev) => {
      const uploadTasks = prev.uploadTasks.map((task) =>
        task.id === id ? { ...task, ...patch } : task,
      )
      const dataFiles = prev.dataFiles.map((file) =>
        file.id === id
          ? { ...file, uploadStatus: patch.uploadStatus ?? file.uploadStatus }
          : file,
      )
      const lastUploadTime =
        patch.uploadStatus === 'success' && patch.completedAt
          ? patch.completedAt
          : prev.stats.lastUploadTime
      return {
        ...prev,
        uploadTasks,
        dataFiles,
        stats: { ...prev.stats, lastUploadTime },
      }
    })
  }, [])

  const handleUpload = useCallback(() => {
    if (!selectedItem || selectedItem.category !== 'upload') return
    const task = selectedItem.data
    if (task.uploadStatus !== 'pending') return
    updateUploadTask(task.id, { uploadStatus: 'uploading', progress: 0 })
    setTimeout(() => {
      updateUploadTask(task.id, {
        uploadStatus: 'success',
        progress: 100,
        completedAt: new Date().toISOString(),
      })
    }, 1200)
  }, [selectedItem, updateUploadTask])

  const handleRetry = useCallback(() => {
    if (!selectedItem || selectedItem.category !== 'upload') return
    const task = selectedItem.data
    if (task.uploadStatus !== 'failed' && task.uploadStatus !== 'cancelled') return
    updateUploadTask(task.id, {
      uploadStatus: 'uploading',
      progress: 0,
      failureReason: undefined,
    })
    setTimeout(() => {
      updateUploadTask(task.id, {
        uploadStatus: 'success',
        progress: 100,
        completedAt: new Date().toISOString(),
      })
    }, 1200)
  }, [selectedItem, updateUploadTask])

  const handleCancel = useCallback(() => {
    if (!selectedItem || selectedItem.category !== 'upload') return
    const task = selectedItem.data
    if (task.uploadStatus !== 'pending' && task.uploadStatus !== 'uploading') return
    updateUploadTask(task.id, {
      uploadStatus: 'cancelled',
      progress: undefined,
    })
  }, [selectedItem, updateUploadTask])

  const canUpload =
    selectedItem?.category === 'upload' && selectedItem.data.uploadStatus === 'pending'
  const canRetry =
    selectedItem?.category === 'upload' &&
    (selectedItem.data.uploadStatus === 'failed' ||
      selectedItem.data.uploadStatus === 'cancelled')
  const canCancel =
    selectedItem?.category === 'upload' &&
    (selectedItem.data.uploadStatus === 'pending' ||
      selectedItem.data.uploadStatus === 'uploading')

  const handleExport = useCallback(() => {
    if (filteredItems.length === 0) return
    exportItems(filteredItems)
    setPageData((prev) => ({
      ...prev,
      operationLogs: [
        {
          id: crypto.randomUUID(),
          timestamp: dayjs().toISOString(),
          user: 'operator',
          deviceName: '系统服务',
          eventType: 'user',
          content: '日志导出',
          oldValue: '',
          newValue: LOG_CATEGORY_LABELS[category],
          result: 'success',
          clientIp: '192.168.1.10',
          terminal: '控制台-1',
        },
        ...prev.operationLogs,
      ],
    }))
  }, [filteredItems, category])

  return {
    stats: pageData.stats,
    category,
    activeUploadPreset,
    filters,
    selectedId,
    selectedItem,
    sortDesc,
    page,
    totalPages,
    pageItems,
    canUpload,
    canRetry,
    canCancel,
    setCategory: handleCategoryChange,
    applyStatClick,
    setFilters: handleFiltersChange,
    setSelectedId,
    setSortDesc: () => setSortDesc((v) => !v),
    setPage,
    handleRefresh,
    handleExport,
    handleUpload,
    handleRetry,
    handleCancel,
  }
}
