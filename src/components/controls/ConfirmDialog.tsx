import HudButton from '../hud/HudButton'
import { controlFieldLabel } from '../../utils/controlLabels'
import type { PendingControl } from '../../types/dashboard'

interface ConfirmDialogProps {
  pending: PendingControl | null
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({ pending, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!pending) return null

  return (
    <div className="hud-modal-backdrop">
      <div className="hud-modal">
        <p className="text-2xs font-bold uppercase tracking-wider text-hud-viewport">
          控制确认
        </p>
        <div className="mt-2 space-y-1 text-2xs">
          <p>
            <span className="text-hud-muted">设备：</span>
            {pending.deviceName}
          </p>
          <p>
            <span className="text-hud-muted">开关：</span>
            {controlFieldLabel(pending.field)}
          </p>
          <p>
            <span className="text-hud-muted">当前：</span>
            {pending.oldValue}
          </p>
          <p>
            <span className="text-hud-muted">目标：</span>
            <span className="text-hud-highlight">{pending.newValue}</span>
          </p>
          <p className="text-hud-accent">{pending.risk}</p>
          <p className="text-hud-tag">操作者：operator · 仿真模式</p>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <HudButton onClick={onCancel}>取消</HudButton>
          <HudButton variant="active" onClick={onConfirm}>
            确认
          </HudButton>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
