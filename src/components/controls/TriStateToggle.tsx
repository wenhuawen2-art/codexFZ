import clsx from 'clsx'
import { TRI_STATE_LABELS } from '../../constants/labels'
import HudBadge from '../hud/HudBadge'
import type { TriState } from '../../types/dashboard'

interface TriStateToggleProps {
  label: string
  value: TriState
  onChange: (v: TriState) => void
  disabled?: boolean
}

const interactiveOptions: TriState[] = ['on', 'off']

function TriStateToggle({ label, value, onChange, disabled }: TriStateToggleProps) {
  if (value === 'disconnected') {
    return (
      <div className="flex items-center gap-1 py-0.5" title={label}>
        <span className="w-6 shrink-0 truncate text-2xs text-hud-muted">{label}</span>
        <HudBadge label="无法连接" variant="offline" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0.5" title={label}>
      <span className="w-6 shrink-0 truncate text-2xs text-hud-muted">{label}</span>
      {interactiveOptions.map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt)}
          className={clsx('hud-pill', value === opt && 'hud-pill-selected')}
        >
          {TRI_STATE_LABELS[opt]}
        </button>
      ))}
    </div>
  )
}

export default TriStateToggle
