import clsx from 'clsx'
import HudBadge from '../hud/HudBadge'
import {
  LOG_EVENT_LEVEL_LABELS,
  LOG_EVENT_TYPE_LABELS,
  UPLOAD_STATUS_LABELS,
  UPLOAD_STATUS_VARIANT,
} from '../../constants/logs'
import { formatLogTime } from '../../lib/formatLogTime'
import type { LogListItem } from '../../types/logs'
import type { OperationLog } from '../../types/dashboard'

interface LogTableProps {
  category: import('../../types/logs').LogCategory
  items: LogListItem[]
  selectedId: string | null
  sortDesc: boolean
  page: number
  totalPages: number
  onSelect: (id: string) => void
  onToggleSort: () => void
  onPageChange: (page: number) => void
}

function operationSummary(row: OperationLog) {
  if (row.result === 'failure' && row.failureReason) {
    return `${row.content} · ${row.failureReason}`
  }
  return row.content
}

function LogTable({
  category,
  items,
  selectedId,
  sortDesc,
  page,
  totalPages,
  onSelect,
  onToggleSort,
  onPageChange,
}: LogTableProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-1 flex items-center justify-between">
        <button type="button" className="text-2xs text-hud-muted hover:text-hud-active" onClick={onToggleSort}>
          时间 {sortDesc ? '↓' : '↑'}
        </button>
        <span className="text-[10px] text-hud-muted">
          第 {page} / {totalPages} 页
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-2xs">
          <thead className="sticky top-0 bg-hud-bg text-hud-muted">
            <tr>
              {category === 'operation' && (
                <>
                  <th className="px-1 py-0.5 text-left font-normal">时间</th>
                  <th className="px-1 py-0.5 text-left font-normal">类型</th>
                  <th className="px-1 py-0.5 text-left font-normal">设备</th>
                  <th className="px-1 py-0.5 text-left font-normal">内容</th>
                  <th className="px-1 py-0.5 text-left font-normal">结果</th>
                </>
              )}
              {category === 'exception' && (
                <>
                  <th className="px-1 py-0.5 text-left font-normal">时间</th>
                  <th className="px-1 py-0.5 text-left font-normal">等级</th>
                  <th className="px-1 py-0.5 text-left font-normal">设备</th>
                  <th className="px-1 py-0.5 text-left font-normal">内容</th>
                </>
              )}
              {category === 'dataFile' && (
                <>
                  <th className="px-1 py-0.5 text-left font-normal">文件名</th>
                  <th className="px-1 py-0.5 text-left font-normal">观测时间</th>
                  <th className="px-1 py-0.5 text-left font-normal">上传</th>
                </>
              )}
              {category === 'upload' && (
                <>
                  <th className="px-1 py-0.5 text-left font-normal">时间</th>
                  <th className="px-1 py-0.5 text-left font-normal">文件名</th>
                  <th className="px-1 py-0.5 text-left font-normal">类型</th>
                  <th className="px-1 py-0.5 text-left font-normal">状态</th>
                </>
              )}
              {category === 'export' && (
                <>
                  <th className="px-1 py-0.5 text-left font-normal">时间</th>
                  <th className="px-1 py-0.5 text-left font-normal">用户</th>
                  <th className="px-1 py-0.5 text-left font-normal">筛选</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const id = item.data.id
              const selected = id === selectedId
              return (
                <tr
                  key={id}
                  onClick={() => onSelect(id)}
                  className={clsx(
                    'cursor-pointer border-t border-hud-border/30',
                    selected && 'bg-hud-active/10',
                  )}
                >
                  {item.category === 'operation' && (
                    <>
                      <td className="whitespace-nowrap px-1 py-1">{formatLogTime(item.data.timestamp)}</td>
                      <td className="px-1 py-1">{LOG_EVENT_TYPE_LABELS[item.data.eventType]}</td>
                      <td className="max-w-[72px] truncate px-1 py-1" title={item.data.deviceName}>
                        {item.data.deviceName}
                      </td>
                      <td className="max-w-[140px] truncate px-1 py-1" title={operationSummary(item.data)}>
                        {operationSummary(item.data)}
                      </td>
                      <td className="px-1 py-1">
                        <HudBadge
                          label={item.data.result === 'success' ? '成功' : '失败'}
                          variant={item.data.result === 'success' ? 'online' : 'alert'}
                        />
                      </td>
                    </>
                  )}
                  {item.category === 'exception' && (
                    <>
                      <td className="whitespace-nowrap px-1 py-1">{formatLogTime(item.data.timestamp)}</td>
                      <td className="px-1 py-1">{LOG_EVENT_LEVEL_LABELS[item.data.level]}</td>
                      <td className="max-w-[72px] truncate px-1 py-1">{item.data.deviceName}</td>
                      <td className="max-w-[180px] truncate px-1 py-1">{item.data.content}</td>
                    </>
                  )}
                  {item.category === 'dataFile' && (
                    <>
                      <td className="max-w-[120px] truncate px-1 py-1">{item.data.fileName}</td>
                      <td className="whitespace-nowrap px-1 py-1">{formatLogTime(item.data.observeTime)}</td>
                      <td className="px-1 py-1">
                        <HudBadge
                          label={UPLOAD_STATUS_LABELS[item.data.uploadStatus]}
                          variant={UPLOAD_STATUS_VARIANT[item.data.uploadStatus]}
                        />
                      </td>
                    </>
                  )}
                  {item.category === 'upload' && (
                    <>
                      <td className="whitespace-nowrap px-1 py-1">{formatLogTime(item.data.timestamp)}</td>
                      <td className="max-w-[120px] truncate px-1 py-1">{item.data.fileName}</td>
                      <td className="px-1 py-1">{item.data.logType}</td>
                      <td className="px-1 py-1">
                        <HudBadge
                          label={UPLOAD_STATUS_LABELS[item.data.uploadStatus]}
                          variant={UPLOAD_STATUS_VARIANT[item.data.uploadStatus]}
                        />
                      </td>
                    </>
                  )}
                  {item.category === 'export' && (
                    <>
                      <td className="whitespace-nowrap px-1 py-1">{formatLogTime(item.data.timestamp)}</td>
                      <td className="px-1 py-1">{item.data.user}</td>
                      <td className="max-w-[160px] truncate px-1 py-1">{item.data.filterSummary}</td>
                    </>
                  )}
                </tr>
              )
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-1 py-4 text-center text-hud-muted">
                  无匹配记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-1 flex shrink-0 justify-end gap-1">
        <button
          type="button"
          className="hud-btn text-2xs"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          上一页
        </button>
        <button
          type="button"
          className="hud-btn text-2xs"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          下一页
        </button>
      </div>
    </div>
  )
}

export default LogTable
