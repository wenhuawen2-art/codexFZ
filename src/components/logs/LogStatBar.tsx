import clsx from 'clsx'
import { LOG_STAT_CARDS } from '../../constants/logs'
import { formatLogTime } from '../../lib/formatLogTime'
import type { LogCategory, LogStats, StatClickAction, UploadStatPreset } from '../../types/logs'

interface LogStatBarProps {
  stats: LogStats
  activeCategory: LogCategory
  activeUploadPreset: UploadStatPreset | null
  onStatClick: (action: StatClickAction) => void
}

function LogStatBar({
  stats,
  activeCategory,
  activeUploadPreset,
  onStatClick,
}: LogStatBarProps) {
  return (
    <div className="grid shrink-0 grid-cols-5 gap-2">
      {LOG_STAT_CARDS.map(({ key, label, category, uploadPreset }) => {
        const active = uploadPreset
          ? activeUploadPreset === uploadPreset
          : activeCategory === category && activeUploadPreset === null

        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (uploadPreset) {
                onStatClick({ type: 'uploadPreset', preset: uploadPreset })
              } else if (category) {
                onStatClick({ type: 'category', category })
              }
            }}
            className={clsx(
              'hud-panel flex flex-col items-start px-2 py-1.5 text-left',
              active && 'ring-1 ring-hud-active/50',
            )}
          >
            <span className="text-[10px] text-hud-muted">{label}</span>
            <span className="text-sm font-semibold text-hud-grid-cross">{stats[key]}</span>
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => onStatClick({ type: 'uploadPreset', preset: 'recent' })}
        className={clsx(
          'hud-panel flex flex-col items-start px-2 py-1.5 text-left',
          activeUploadPreset === 'recent' && 'ring-1 ring-hud-active/50',
        )}
      >
        <span className="text-[10px] text-hud-muted">最近上传</span>
        <span className="truncate text-sm font-semibold text-hud-grid-cross">
          {formatLogTime(stats.lastUploadTime)}
        </span>
      </button>
    </div>
  )
}

export default LogStatBar
