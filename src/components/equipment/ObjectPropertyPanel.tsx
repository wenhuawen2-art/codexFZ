import HudPanel from '../hud/HudPanel'
import HudBadge from '../hud/HudBadge'
import EquipmentDeviceActions from './EquipmentDeviceActions'
import { getEquipmentNode, type EquipmentLayerKey } from '../../constants/equipmentRoom'
import type { DeviceControlHandlers } from '../../hooks/useDeviceControlHandlers'
import type {
  DeviceControls,
  SkylightStatus,
  UserRole,
} from '../../types/dashboard'
import { resolveEquipmentNodeStatus } from '../../utils/equipmentNodeStatus'

interface ObjectPropertyPanelProps {
  selectedNodeId: string | null
  controls: DeviceControls
  userRole: UserRole
  controlHandlers: DeviceControlHandlers
  visibleLayers?: Record<EquipmentLayerKey, boolean>
  skylightStatus?: SkylightStatus
}

function ObjectPropertyPanel({
  selectedNodeId,
  controls,
  userRole,
  controlHandlers,
  visibleLayers,
  skylightStatus,
}: ObjectPropertyPanelProps) {
  const node = getEquipmentNode(selectedNodeId)

  const property =
    node?.property ??
    (node
      ? {
          name: node.label,
          status: '—',
          statusVariant: 'offline' as const,
          description: '图层或分组节点，可在 UE 视口中查看',
        }
      : null)

  const liveStatus = node
    ? resolveEquipmentNodeStatus(node.id, {
        controls,
        skylightStatus,
        layerKey: node.layerKey,
        visibleLayers,
        fallback: property
          ? { status: property.status, statusVariant: property.statusVariant }
          : undefined,
      })
    : null

  return (
    <aside className="flex h-full w-[226px] shrink-0 flex-col overflow-hidden bg-hud-bg p-2">
      {!node || !property ? (
        <HudPanel title="对象属性" className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <p className="text-2xs text-hud-muted">左键点击场景树或 UE 模型查看属性</p>
        </HudPanel>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto">
          <HudPanel title="对象属性">
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-2xs text-hud-muted">名称</p>
                <p className="text-2xs font-bold text-hud-text">{property.name}</p>
              </div>
              <div>
                <p className="text-2xs text-hud-muted">状态</p>
                <HudBadge label={liveStatus?.label ?? '—'} variant={liveStatus?.variant ?? 'offline'} />
              </div>
              {property.relatedDevice && (
                <div>
                  <p className="text-2xs text-hud-muted">关联设备</p>
                  <p className="text-2xs text-hud-text">{property.relatedDevice}</p>
                </div>
              )}
              <div>
                <p className="text-2xs text-hud-muted">说明</p>
                <p className="text-2xs leading-snug text-hud-text">{property.description}</p>
              </div>
              {node.contextActions && node.contextActions.length > 0 && (
                <p className="text-[10px] text-hud-muted">右键可执行快捷操作</p>
              )}
            </div>
          </HudPanel>

          <HudPanel title="相关操作">
            <EquipmentDeviceActions
              nodeId={selectedNodeId}
              controls={controls}
              skylightStatus={skylightStatus ?? 'closed'}
              userRole={userRole}
              handlers={controlHandlers}
            />
          </HudPanel>
        </div>
      )}
    </aside>
  )
}

export default ObjectPropertyPanel
