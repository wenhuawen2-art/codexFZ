import { Fragment } from 'react'
import clsx from 'clsx'
import { TRI_STATE_LABELS } from '../../constants/labels'
import type { DeviceControls, TriState } from '../../types/dashboard'

const FIELDS = [
  { key: 'amplifier' as const, label: '放大级' },
  { key: 'oscillator' as const, label: '振荡级' },
  { key: 'qSwitch' as const, label: 'Q-Switch' },
]

interface LaserControlGridProps {
  lasers: DeviceControls['lasers']
  disabled?: boolean
  onChange: (id: number, field: 'amplifier' | 'oscillator' | 'qSwitch', value: TriState) => void
}

function ToggleCell({
  value,
  disabled,
  onToggle,
}: {
  value: TriState
  disabled?: boolean
  onToggle: () => void
}) {
  if (value === 'disconnected') {
    return (
      <div className="flex h-[22px] items-center justify-center">
        <span className="truncate text-2xs leading-none text-hud-muted">断连</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={clsx(
        'hud-pill w-full min-w-0 px-0.5',
        value === 'on' && 'hud-pill-selected',
      )}
    >
      {TRI_STATE_LABELS[value]}
    </button>
  )
}

function LaserControlGrid({ lasers, disabled, onChange }: LaserControlGridProps) {
  return (
    <div className="grid grid-cols-[22px_1fr_1fr_1fr] gap-x-0.5 gap-y-0.5">
      <div />
      {FIELDS.map((f) => (
        <p
          key={f.key}
          className="truncate text-center text-2xs leading-tight text-hud-muted"
          title={f.label}
        >
          {f.label}
        </p>
      ))}

      {lasers.map((laser) => (
        <Fragment key={laser.id}>
          <p className="self-center text-2xs text-hud-viewport">L{laser.id}</p>
          {FIELDS.map((f) => (
            <ToggleCell
              key={f.key}
              value={laser[f.key]}
              disabled={disabled || laser[f.key] === 'disconnected'}
              onToggle={() =>
                onChange(laser.id, f.key, laser[f.key] === 'on' ? 'off' : 'on')
              }
            />
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export default LaserControlGrid
