import {
  DEVICE_SECTION,
  DEVICE_SHORT,
  laserUnitName,
  telescopeGroupName,
} from './deviceNames'

export type EquipmentLayerKey =
  | 'outdoor'
  | 'building'
  | 'roof'
  | 'walls'
  | 'floor'
  | 'indoorDevices'
  | 'pipelines'

export type EquipmentViewPreset = 'default' | 'top' | 'section'

export type EquipmentDeviceType =
  | 'laser'
  | 'telescope'
  | 'cooling'
  | 'snspd'
  | 'seedLaser'
  | 'tcspc'

export type EquipmentQuickActionId = 'skylight-open' | 'skylight-close'

export type EquipmentFocusTarget =
  | { kind: 'outdoor' }
  | { kind: 'building'; layerKey?: EquipmentLayerKey }
  | { kind: 'layer'; layerKey: EquipmentLayerKey }
  | { kind: 'deviceType'; deviceType: EquipmentDeviceType }
  | { kind: 'device'; deviceId: string }

export interface EquipmentContextAction {
  id: EquipmentQuickActionId
  label: string
}

export interface EquipmentObjectMeta {
  name: string
  status: string
  statusVariant: 'online' | 'offline' | 'simulated' | 'alert'
  relatedDevice?: string
  description: string
}

export interface EquipmentTreeNode {
  id: string
  label: string
  children?: EquipmentTreeNode[]
  layerKey?: EquipmentLayerKey
  focus?: EquipmentFocusTarget
  contextActions?: EquipmentContextAction[]
  property?: EquipmentObjectMeta
}

export const EQUIPMENT_VIEW_LABELS: Record<EquipmentViewPreset, string> = {
  default: '默认',
  top: '俯视',
  section: '剖切',
}

const SKYLIGHT_ACTIONS: EquipmentContextAction[] = [
  { id: 'skylight-open', label: '天窗 · 开' },
  { id: 'skylight-close', label: '天窗 · 关' },
]

function laserNode(id: number): EquipmentTreeNode {
  return {
    id: `laser-${id}`,
    label: `L${id}`,
    focus: { kind: 'device', deviceId: `laser-${id}` },
    property: {
      name: laserUnitName(id),
      status: id <= 2 ? '运行中' : '待机',
      statusVariant: id <= 2 ? 'simulated' : 'online',
      relatedDevice: `L${id}`,
      description: '高能量脉冲激光发射系统单体视角',
    },
  }
}

function telescopeGroupNode(id: number): EquipmentTreeNode {
  return {
    id: `tel-group-${id}`,
    label: `组${id}`,
    focus: { kind: 'device', deviceId: `tel-group-${id}` },
    property: {
      name: telescopeGroupName(id),
      status: '待机',
      statusVariant: 'online',
      relatedDevice: `T${id}`,
      description: '收发光学望远镜阵列单组视角（含发射筒与接收筒）',
    },
  }
}

export const EQUIPMENT_SCENE_TREE: EquipmentTreeNode[] = [
  {
    id: 'root-outdoor',
    label: '室外环境',
    focus: { kind: 'outdoor' },
    property: {
      name: '室外环境',
      status: '已加载',
      statusVariant: 'online',
      description: '站点周边地形、道路、天空与日照效果',
    },
    children: [
      {
        id: 'layer-outdoor',
        label: '室外环境',
        layerKey: 'outdoor',
        focus: { kind: 'layer', layerKey: 'outdoor' },
        property: {
          name: '室外环境图层',
          status: '可见',
          statusVariant: 'online',
          description: '控制室外地形、道路、天空等显隐',
        },
      },
    ],
  },
  {
    id: 'root-building',
    label: '设备间',
    focus: { kind: 'building' },
    property: {
      name: '设备间',
      status: '已加载',
      statusVariant: 'online',
      description: '设备间建筑整体视角',
    },
    children: [
      {
        id: 'layer-building',
        label: '设备间外观',
        layerKey: 'building',
        focus: { kind: 'layer', layerKey: 'building' },
        property: {
          name: '设备间外观',
          status: '可见',
          statusVariant: 'online',
          description: '建筑外壳、门窗结构',
        },
      },
      {
        id: 'layer-roof',
        label: '屋顶',
        layerKey: 'roof',
        focus: { kind: 'layer', layerKey: 'roof' },
        property: {
          name: '屋顶',
          status: '可见',
          statusVariant: 'online',
          description: '屋顶结构图层',
        },
      },
      {
        id: 'layer-walls',
        label: '墙体',
        layerKey: 'walls',
        focus: { kind: 'layer', layerKey: 'walls' },
        property: {
          name: '墙体',
          status: '可见',
          statusVariant: 'online',
          description: '设备间墙体图层',
        },
      },
      {
        id: 'layer-floor',
        label: '地板',
        layerKey: 'floor',
        focus: { kind: 'layer', layerKey: 'floor' },
        property: {
          name: '地板',
          status: '可见',
          statusVariant: 'online',
          description: '室内地面图层',
        },
      },
      {
        id: 'layer-pipelines',
        label: '管线',
        layerKey: 'pipelines',
        focus: { kind: 'layer', layerKey: 'pipelines' },
        property: {
          name: '管线',
          status: '隐藏',
          statusVariant: 'offline',
          description: '冷却与线缆管道路由',
        },
      },
    ],
  },
  {
    id: 'root-indoor',
    label: '室内设备',
    focus: { kind: 'layer', layerKey: 'indoorDevices' },
    property: {
      name: '室内设备',
      status: '已加载',
      statusVariant: 'online',
      description: '室内全部设备布局',
    },
    children: [
      {
        id: 'type-seed-laser',
        label: DEVICE_SECTION.seedLaser,
        focus: { kind: 'deviceType', deviceType: 'seedLaser' },
        property: {
          name: DEVICE_SECTION.seedLaser,
          status: '单频',
          statusVariant: 'online',
          relatedDevice: DEVICE_SECTION.seedLaser,
          description: '种子光源与锁频链路',
        },
      },
      {
        id: 'type-laser',
        label: DEVICE_SECTION.laser,
        focus: { kind: 'deviceType', deviceType: 'laser' },
        property: {
          name: `${DEVICE_SECTION.laser}（5台）`,
          status: '运行中',
          statusVariant: 'simulated',
          relatedDevice: 'L1–L5',
          description: '五台1083nm激光器整体视角',
        },
        children: [1, 2, 3, 4, 5].map(laserNode),
      },
      {
        id: 'type-telescope',
        label: DEVICE_SECTION.telescope,
        focus: { kind: 'deviceType', deviceType: 'telescope' },
        property: {
          name: '收发光学望远镜阵列',
          status: '待机',
          statusVariant: 'online',
          relatedDevice: 'T1–T3',
          description: '三组望远镜阵列整体视角',
        },
        children: [1, 2, 3].map(telescopeGroupNode),
      },
      {
        id: 'type-snspd',
        label: DEVICE_SECTION.snspd,
        focus: { kind: 'deviceType', deviceType: 'snspd' },
        property: {
          name: '超导纳米线单光子探测器',
          status: '观测模式',
          statusVariant: 'online',
          relatedDevice: DEVICE_SHORT.snspd,
          description: '接收链路末端探测器',
        },
      },
      {
        id: 'type-tcspc',
        label: DEVICE_SECTION.tcspc,
        focus: { kind: 'deviceType', deviceType: 'tcspc' },
        property: {
          name: '时间相关单光子计数器',
          status: '开',
          statusVariant: 'online',
          relatedDevice: DEVICE_SHORT.tcspc,
          description: '与超导探测器配套的计时计数电子设备',
        },
      },
      {
        id: 'type-cooling',
        label: DEVICE_SECTION.cooling,
        focus: { kind: 'deviceType', deviceType: 'cooling' },
        property: {
          name: '制冷与冷却系统',
          status: '在线',
          statusVariant: 'online',
          relatedDevice: DEVICE_SHORT.snspd,
          description: '制冷机、冷却管路与控制柜',
        },
      },
      {
        id: 'device-skylight',
        label: DEVICE_SECTION.skylight,
        focus: { kind: 'device', deviceId: 'skylight' },
        contextActions: SKYLIGHT_ACTIONS,
        property: {
          name: DEVICE_SECTION.skylight,
          status: '关',
          statusVariant: 'offline',
          relatedDevice: '天窗控制',
          description: '屋顶天窗开关；右键可快捷开/关',
        },
      },
    ],
  },
]

export const EQUIPMENT_LAYER_KEYS: EquipmentLayerKey[] = [
  'outdoor',
  'building',
  'roof',
  'walls',
  'floor',
  'indoorDevices',
  'pipelines',
]

export function createDefaultVisibleLayers(): Record<
  EquipmentLayerKey,
  boolean
> {
  return {
    outdoor: true,
    building: true,
    roof: true,
    walls: true,
    floor: true,
    indoorDevices: true,
    pipelines: false,
  }
}

export function collectDefaultExpandedIds(): string[] {
  const ids: string[] = []
  walkTree(EQUIPMENT_SCENE_TREE, (node) => {
    if (node.children?.length) ids.push(node.id)
  })
  return ids
}

function walkTree(
  nodes: EquipmentTreeNode[],
  visit: (node: EquipmentTreeNode) => void,
) {
  for (const node of nodes) {
    visit(node)
    if (node.children) walkTree(node.children, visit)
  }
}

export function getEquipmentNode(id: string | null): EquipmentTreeNode | null {
  if (!id) return null
  let found: EquipmentTreeNode | null = null
  walkTree(EQUIPMENT_SCENE_TREE, (node) => {
    if (node.id === id) found = node
  })
  return found
}

export function getNodeFocus(node: EquipmentTreeNode): EquipmentFocusTarget {
  if (node.focus) return node.focus
  if (node.layerKey) return { kind: 'layer', layerKey: node.layerKey }
  return { kind: 'outdoor' }
}

/** @deprecated use getEquipmentNode */
export function getEquipmentObject(id: string | null) {
  const node = getEquipmentNode(id)
  if (!node?.property) return null
  return {
    id: node.id,
    pillLabel: node.label,
    ...node.property,
    actions: node.contextActions?.map((a) => a.label) ?? [],
  }
}
