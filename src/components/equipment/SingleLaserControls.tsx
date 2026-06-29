import clsx from 'clsx'
import HudBadge from '../hud/HudBadge'
import { TRI_STATE_LABELS } from '../../constants/labels'
import type { LaserUnit, TriState } from '../../types/dashboard'

const FIELDS = [
  { key: 'amplifier' as const, label: '放大级' },
  { key: 'oscillator' as const, label: '振荡级' },
  { key: 'qSwitch' as const, label: 'Q-Switch' },
]

interface SingleLaserControlsProps {
  laser: LaserUnit
  disabled?: boolean
  onChange: (field: 'amplifier' | 'oscillator' | 'qSwitch', value: TriState) => void
}

function SingleLaserControls({ laser, disabled, onChange }: SingleLaserControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      {FIELDS.map((field) => {
        const value = laser[field.key]
        return (
          <div key={field.key}>
            <p className="hud-device-title">{field.label}</p>
            {value === 'disconnected' ? (
              <HudBadge label="无法连接" variant="offline" />
            ) : (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(field.key, value === 'on' ? 'off' : 'on')}
                className={clsx(
                  'hud-pill mt-1 min-h-[26px] w-full px-2',
                  value === 'on' && 'hud-pill-selected',
                )}
              >
                {TRI_STATE_LABELS[value]}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SingleLaserControls
