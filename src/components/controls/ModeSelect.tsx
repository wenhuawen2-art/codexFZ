import clsx from 'clsx'
import HudBadge from '../hud/HudBadge'

interface ModeSelectProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  disabled?: boolean
  compact?: boolean
  disconnectedValue?: T
  disconnectedLabel?: string
}

function ModeSelect<T extends string>({
  options,
  value,
  onChange,
  disabled,
  compact,
  disconnectedValue,
  disconnectedLabel = '无法连接',
}: ModeSelectProps<T>) {
  if (disconnectedValue !== undefined && value === disconnectedValue) {
    return <HudBadge label={disconnectedLabel} variant="offline" />
  }

  return (
    <div
      className={clsx(
        'flex gap-0.5',
        compact ? 'flex-nowrap gap-px' : 'flex-wrap',
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'hud-pill rounded-[4px]',
            compact && 'min-w-0 flex-1 truncate px-0.5',
            value === opt.value && 'hud-pill-selected',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default ModeSelect
