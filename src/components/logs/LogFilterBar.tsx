import HudInput from '../hud/HudInput'
import HudDateTimePicker from '../controls/HudDateTimePicker'
import {
  LOG_DEVICE_OPTIONS,
  LOG_EVENT_TYPE_OPTIONS,
  LOG_LEVEL_OPTIONS,
  UPLOAD_LOG_TYPE_OPTIONS,
  UPLOAD_STATUS_FILTER_OPTIONS,
} from '../../constants/logs'
import type { LogCategory, LogFilters } from '../../types/logs'

interface LogFilterBarProps {
  category: LogCategory
  filters: LogFilters
  onChange: (patch: Partial<LogFilters>) => void
}

function LogFilterBar({ category, filters, onChange }: LogFilterBarProps) {
  const showDevice = category === 'operation' || category === 'exception'
  const showEventType = category === 'operation'
  const showLevel = category === 'exception'
  const showTime =
    category === 'operation' ||
    category === 'exception' ||
    category === 'dataFile' ||
    category === 'export' ||
    category === 'upload'
  const showUploadFilters = category === 'upload'

  return (
    <div className="flex shrink-0 flex-wrap items-end gap-2">
      {showTime && (
        <>
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] text-hud-muted">开始</span>
            <HudDateTimePicker
              value={filters.start}
              onChange={(start) => onChange({ start })}
              storageFormat="filter"
              className="w-[168px]"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] text-hud-muted">结束</span>
            <HudDateTimePicker
              value={filters.end}
              onChange={(end) => onChange({ end })}
              storageFormat="filter"
              className="w-[168px]"
            />
          </label>
        </>
      )}
      {showUploadFilters && (
        <>
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] text-hud-muted">类型</span>
            <select
              value={filters.uploadLogType}
              onChange={(e) => onChange({ uploadLogType: e.target.value })}
              className="hud-input w-[100px] text-2xs"
            >
              {UPLOAD_LOG_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-[10px] text-hud-muted">状态</span>
            <select
              value={filters.uploadStatus}
              onChange={(e) => onChange({ uploadStatus: e.target.value })}
              className="hud-input w-[100px] text-2xs"
            >
              {UPLOAD_STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
      {showDevice && (
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] text-hud-muted">设备</span>
          <select
            value={filters.device}
            onChange={(e) => onChange({ device: e.target.value })}
            className="hud-input w-[120px] text-2xs"
          >
            {LOG_DEVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      )}
      {showEventType && (
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] text-hud-muted">事件类型</span>
          <select
            value={filters.eventType}
            onChange={(e) => onChange({ eventType: e.target.value })}
            className="hud-input w-[120px] text-2xs"
          >
            {LOG_EVENT_TYPE_OPTIONS.filter(
              (o) =>
                !o.value ||
                o.value === 'power' ||
                o.value === 'param' ||
                o.value === 'control' ||
                o.value === 'user',
            ).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      )}
      {showLevel && (
        <label className="flex flex-col gap-0.5">
          <span className="text-[10px] text-hud-muted">等级</span>
          <select
            value={filters.level}
            onChange={(e) => onChange({ level: e.target.value })}
            className="hud-input w-[100px] text-2xs"
          >
            {LOG_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="flex min-w-[120px] flex-1 flex-col gap-0.5">
        <span className="text-[10px] text-hud-muted">关键词</span>
        <HudInput
          value={filters.keyword}
          onChange={(e) => onChange({ keyword: e.target.value })}
          placeholder="搜索…"
        />
      </label>
    </div>
  )
}

export default LogFilterBar
