import type {
  DeviceControls,
  MagneticSettings,
  MagneticView,
  RadarView,
  SceneId,
  SunEarthSettings,
  SunEarthView,
} from '../types/dashboard'
import type {
  EquipmentFocusTarget,
  EquipmentLayerKey,
  EquipmentQuickActionId,
  EquipmentViewPreset,
} from '../constants/equipmentRoom'

export type UeMessage =
  | { type: 'SET_MAIN_SCENE'; scene: SceneId }
  | { type: 'SET_RADAR_VIEW'; view: RadarView }
  | { type: 'SET_SUN_EARTH_VIEW'; view: SunEarthView }
  | { type: 'SYNC_SUN_EARTH_SETTINGS'; payload: SunEarthSettings }
  | { type: 'SET_MAGNETIC_VIEW'; view: MagneticView }
  | { type: 'SYNC_MAGNETIC_SETTINGS'; payload: MagneticSettings }
  | { type: 'SYNC_DEVICE_STATE'; payload: DeviceControls }
  | { type: 'SWAP_SCENE'; main: SceneId; thumbnails: SceneId[] }
  | { type: 'SYNC_EQUIPMENT_LAYERS'; payload: Record<EquipmentLayerKey, boolean> }
  | { type: 'SYNC_EQUIPMENT_FOCUS'; payload: { nodeId: string; target: EquipmentFocusTarget } }
  | { type: 'SYNC_EQUIPMENT_QUICK_ACTION'; actionId: EquipmentQuickActionId; nodeId: string }
  | { type: 'SYNC_EQUIPMENT_SELECTION'; objectId: string | null }
  | { type: 'SYNC_EQUIPMENT_VIEW'; preset: EquipmentViewPreset }
  | { type: 'SYNC_DAYLIGHT_TIME'; payload: { hour: number; weatherFxEnabled: boolean } }

const UE_TARGET = '*'

export function sendToUe(message: UeMessage) {
  if (import.meta.env.DEV) {
    console.debug('[ueBridge]', message)
  }
  window.postMessage({ source: 'laser-radar-fe', ...message }, UE_TARGET)
}

export function syncScene(main: SceneId, thumbnails: SceneId[]) {
  sendToUe({ type: 'SET_MAIN_SCENE', scene: main })
  sendToUe({ type: 'SWAP_SCENE', main, thumbnails })
}

export function syncRadarView(view: RadarView) {
  sendToUe({ type: 'SET_RADAR_VIEW', view })
}

export function syncSunEarthView(view: SunEarthView) {
  sendToUe({ type: 'SET_SUN_EARTH_VIEW', view })
}

export function syncSunEarthSettings(payload: SunEarthSettings) {
  sendToUe({ type: 'SYNC_SUN_EARTH_SETTINGS', payload })
}

export function syncMagneticView(view: MagneticView) {
  sendToUe({ type: 'SET_MAGNETIC_VIEW', view })
}

export function syncMagneticSettings(payload: MagneticSettings) {
  sendToUe({ type: 'SYNC_MAGNETIC_SETTINGS', payload })
}

export function syncDeviceState(controls: DeviceControls) {
  sendToUe({ type: 'SYNC_DEVICE_STATE', payload: controls })
}

export function syncEquipmentLayers(payload: Record<EquipmentLayerKey, boolean>) {
  sendToUe({ type: 'SYNC_EQUIPMENT_LAYERS', payload })
}

export function syncEquipmentFocus(nodeId: string, target: EquipmentFocusTarget) {
  sendToUe({ type: 'SYNC_EQUIPMENT_FOCUS', payload: { nodeId, target } })
}

export function syncEquipmentQuickAction(
  actionId: EquipmentQuickActionId,
  nodeId: string,
) {
  sendToUe({ type: 'SYNC_EQUIPMENT_QUICK_ACTION', actionId, nodeId })
}

export function syncEquipmentSelection(objectId: string | null) {
  sendToUe({ type: 'SYNC_EQUIPMENT_SELECTION', objectId })
}

export function syncEquipmentView(preset: EquipmentViewPreset) {
  sendToUe({ type: 'SYNC_EQUIPMENT_VIEW', preset })
}

export function syncDaylightTime(payload: { hour: number; weatherFxEnabled: boolean }) {
  sendToUe({ type: 'SYNC_DAYLIGHT_TIME', payload })
}
