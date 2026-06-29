import HudButton from '../hud/HudButton'

interface LogActionBarProps {
  canUpload: boolean
  canRetry: boolean
  canCancel: boolean
  onExport: () => void
  onUpload: () => void
  onRetry: () => void
  onCancel: () => void
  onRefresh: () => void
}

function LogActionBar({
  canUpload,
  canRetry,
  canCancel,
  onExport,
  onUpload,
  onRetry,
  onCancel,
  onRefresh,
}: LogActionBarProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-hud-border/30 pt-2">
      <HudButton onClick={onExport}>导出 CSV</HudButton>
      <HudButton onClick={onUpload} disabled={!canUpload}>
        上传
      </HudButton>
      <HudButton onClick={onRetry} disabled={!canRetry}>
        重试
      </HudButton>
      <HudButton onClick={onCancel} disabled={!canCancel}>
        取消任务
      </HudButton>
      <HudButton onClick={onRefresh}>刷新</HudButton>
    </div>
  )
}

export default LogActionBar
