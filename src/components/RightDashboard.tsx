import HudPanel from './hud/HudPanel'
import HudBadge from './hud/HudBadge'
import ConnectionList from './hud/ConnectionList'
import CloudTimeline from './viewport/CloudTimeline'
import LaserControlGrid from './controls/LaserControlGrid'
import ModeSelect from './controls/ModeSelect'
import {
  ACQUISITION_LABELS,
  SEED_LASER_LABELS,
  SNSPD_LABELS,
  TELESCOPE_MODE_LABELS,
  canControl,
} from '../constants/labels'
import { DEVICE_SECTION } from '../constants/deviceNames'
import type {
  AcquisitionMode,
  DeviceControls,
  SeedLaserMode,
  SnspdMode,
  TelescopeMode,
  TriState,
  UserRole,
  DataConnectionItem,
} from '../types/dashboard'

interface RightDashboardProps {
  controls: DeviceControls
  connections: DataConnectionItem[]
  userRole: UserRole
  onLaserChange: (
    id: number,
    field: 'amplifier' | 'oscillator' | 'qSwitch',
    value: TriState,
  ) => void
  onSeedLaserChange: (v: SeedLaserMode) => void
  onTelescopeChange: (id: number, mode: TelescopeMode) => void
  onSnspdChange: (v: SnspdMode) => void
  onTcspcChange: (v: TriState) => void
  onAcquisitionChange: (v: AcquisitionMode) => void
}

const seedOptions = Object.entries(SEED_LASER_LABELS)
  .filter(([v]) => v !== 'disconnected')
  .map(([value, label]) => ({ value: value as SeedLaserMode, label }))

const snspdOptions = Object.entries(SNSPD_LABELS)
  .filter(([v]) => v !== 'disconnected')
  .map(([value, label]) => ({ value: value as SnspdMode, label }))

const acqOptions = Object.entries(ACQUISITION_LABELS).map(([value, label]) => ({
  value: value as AcquisitionMode,
  label,
}))

const telOptions = Object.entries(TELESCOPE_MODE_LABELS)
  .filter(([v]) => v !== 'disconnected')
  .map(([value, label]) => ({
    value: value as TelescopeMode,
    label: label.length > 4 ? label.slice(0, 4) : label,
  }))

function RightDashboard({
  controls,
  connections,
  userRole,
  onLaserChange,
  onSeedLaserChange,
  onTelescopeChange,
  onSnspdChange,
  onTcspcChange,
  onAcquisitionChange,
}: RightDashboardProps) {
  const disabled = !canControl(userRole)

  return (
    <aside className="flex h-full w-[226px] shrink-0 flex-col overflow-hidden bg-hud-bg p-2">
      <div className="hud-rail-stack-l1 hud-rail-stack-right flex min-h-0 flex-1 flex-col">
        <HudPanel title="设备控制" className="flex min-h-0 flex-[3] flex-col">
          <div className="hud-rail-stack-l2 hud-rail-stack-right min-h-0 flex-1">
            <section>
              <p className="hud-device-title">{DEVICE_SECTION.laser}</p>
              <LaserControlGrid
                lasers={controls.lasers}
                disabled={disabled}
                onChange={onLaserChange}
              />
            </section>

            <section>
              <p className="hud-device-title">{DEVICE_SECTION.seedLaser}</p>
              <ModeSelect
                options={seedOptions}
                value={controls.seedLaser}
                disabled={disabled}
                compact
                disconnectedValue="disconnected"
                onChange={onSeedLaserChange}
              />
            </section>

            <section>
              <p className="hud-device-title">{DEVICE_SECTION.telescope}</p>
              <div className="hud-rail-stack-l2 hud-rail-stack-right">
                {controls.telescopes.map((t) => (
                  <div key={t.id}>
                    <p className="hud-device-title">组{t.id}</p>
                    <ModeSelect
                      options={telOptions}
                      value={t.mode}
                      disabled={disabled}
                      compact
                      disconnectedValue="disconnected"
                      onChange={(m) => onTelescopeChange(t.id, m)}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="hud-device-title">{DEVICE_SECTION.snspd}</p>
              <ModeSelect
                options={snspdOptions}
                value={controls.snspd}
                disabled={disabled}
                compact
                disconnectedValue="disconnected"
                onChange={onSnspdChange}
              />
            </section>

            <section>
              <p className="hud-device-title">{DEVICE_SECTION.tcspc}</p>

              {controls.tcspc === 'disconnected' ? (
                <HudBadge label="无法连接" variant="offline" />
              ) : (
                <ModeSelect
                  options={[
                    { value: 'on' as TriState, label: '开' },
                    { value: 'off' as TriState, label: '关' },
                  ]}
                  value={controls.tcspc}
                  disabled={disabled}
                  compact
                  onChange={onTcspcChange}
                />
              )}
            </section>

            <section>
              <p className="hud-device-title">{DEVICE_SECTION.acquisition}</p>
              <ModeSelect
                options={acqOptions}
                value={controls.acquisition}
                disabled={disabled}
                compact
                onChange={onAcquisitionChange}
              />
            </section>
          </div>
        </HudPanel>

        <HudPanel
          title="数据接入"
          className="flex min-h-0 flex-[2] flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 overflow-hidden">
            <ConnectionList connections={connections} />
          </div>
        </HudPanel>
      </div>

      <div className="hud-rail-cloud-gap">
        <CloudTimeline />
      </div>
    </aside>
  )
}

export default RightDashboard
