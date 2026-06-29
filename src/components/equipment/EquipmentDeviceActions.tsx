import HudBadge from '../hud/HudBadge'
import ModeSelect from '../controls/ModeSelect'
import SingleLaserControls from './SingleLaserControls'
import {
  SEED_LASER_LABELS,
  SKYLIGHT_LABELS,
  SNSPD_LABELS,
  TELESCOPE_MODE_LABELS,
  canControl,
} from '../../constants/labels'
import type {
  DeviceControls,
  SeedLaserMode,
  SkylightStatus,
  SnspdMode,
  TelescopeMode,
  TriState,
  UserRole,
} from '../../types/dashboard'
import type { DeviceControlHandlers } from '../../hooks/useDeviceControlHandlers'
import {
  getEquipmentActionKind,
  type EquipmentActionKind,
} from '../../utils/equipmentDeviceActions'

const seedOptions = Object.entries(SEED_LASER_LABELS)
  .filter(([v]) => v !== 'disconnected')
  .map(([value, label]) => ({
    value: value as SeedLaserMode,
    label,
  }))

const telOptions = Object.entries(TELESCOPE_MODE_LABELS)
  .filter(([v]) => v !== 'disconnected')
  .map(([value, label]) => ({
    value: value as TelescopeMode,
    label,
  }))

const snspdOptions = Object.entries(SNSPD_LABELS)
  .filter(([v]) => v !== 'disconnected')
  .map(([value, label]) => ({
    value: value as SnspdMode,
    label,
  }))

const skylightOptions = [
  { value: 'open' as const, label: SKYLIGHT_LABELS.open },
  { value: 'closed' as const, label: SKYLIGHT_LABELS.closed },
]

const tcspcOptions = [
  { value: 'on' as TriState, label: '开' },
  { value: 'off' as TriState, label: '关' },
]

interface EquipmentDeviceActionsProps {
  nodeId: string | null
  controls: DeviceControls
  skylightStatus: SkylightStatus
  userRole: UserRole
  handlers: DeviceControlHandlers
}

function renderActions(
  kind: EquipmentActionKind,
  props: EquipmentDeviceActionsProps,
  disabled: boolean,
) {
  const { controls, skylightStatus, handlers } = props

  switch (kind.type) {
    case 'laser': {
      const laser = controls.lasers.find((l) => l.id === kind.id)
      if (!laser) return null
      return (
        <SingleLaserControls
          laser={laser}
          disabled={disabled}
          onChange={(field, value) =>
            handlers.onLaserChange(kind.id, field, value)
          }
        />
      )
    }
    case 'telescope': {
      const tel = controls.telescopes.find((t) => t.id === kind.id)
      if (!tel) return null
      return (
        <div className="flex flex-col gap-2">
          <p className="hud-device-title">指向模式</p>
          <ModeSelect
            options={telOptions}
            value={tel.mode}
            disabled={disabled}
            disconnectedValue="disconnected"
            onChange={(mode) => handlers.onTelescopeChange(kind.id, mode)}
          />
        </div>
      )
    }
    case 'snspd':
      return (
        <div className="flex flex-col gap-2">
          <p className="hud-device-title">工作模式</p>
          <ModeSelect
            options={snspdOptions}
            value={controls.snspd}
            disabled={disabled}
            disconnectedValue="disconnected"
            onChange={handlers.onSnspdChange}
          />
        </div>
      )
    case 'seed-laser':
      return (
        <div className="flex flex-col gap-2">
          <p className="hud-device-title">工作模式</p>
          <ModeSelect
            options={seedOptions}
            value={controls.seedLaser}
            disabled={disabled}
            disconnectedValue="disconnected"
            onChange={handlers.onSeedLaserChange}
          />
        </div>
      )
    case 'tcspc':
      if (controls.tcspc === 'disconnected') {
        return <HudBadge label="无法连接" variant="offline" />
      }
      return (
        <div className="flex flex-col gap-2">
          <p className="hud-device-title">开关</p>
          <ModeSelect
            options={tcspcOptions}
            value={controls.tcspc}
            disabled={disabled}
            onChange={handlers.onTcspcChange}
          />
        </div>
      )
    case 'skylight':
      if (skylightStatus === 'fault' || skylightStatus === 'executing') {
        return (
          <div className="flex flex-col gap-2">
            <p className="hud-device-title">天窗开关</p>
            <HudBadge
              label={SKYLIGHT_LABELS[skylightStatus]}
              variant={skylightStatus === 'fault' ? 'alert' : 'simulated'}
            />
          </div>
        )
      }
      return (
        <div className="flex flex-col gap-2">
          <p className="hud-device-title">天窗开关</p>
          <ModeSelect
            options={skylightOptions}
            value={skylightStatus === 'open' ? 'open' : 'closed'}
            disabled={disabled}
            onChange={handlers.onSkylightChange}
          />
        </div>
      )
    case 'cooling-readonly':
      return (
        <p className="text-2xs leading-snug text-hud-muted">
          制冷系统无独立控制项，请通过超导探测器节点查看与操作。
        </p>
      )
    case 'none':
      return (
        <p className="text-2xs text-hud-muted">
          请选择具体设备（如 L1、望远镜组、超导探测器、单光子计数器、天窗）以操作
        </p>
      )
    default:
      return null
  }
}

function EquipmentDeviceActions(props: EquipmentDeviceActionsProps) {
  const { nodeId, userRole } = props
  const kind = getEquipmentActionKind(nodeId)
  const disabled = !canControl(userRole)

  return renderActions(kind, props, disabled)
}

export default EquipmentDeviceActions
