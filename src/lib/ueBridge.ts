import type {
  DeviceControls,
  MagneticSettings,
  MagneticView,
  RadarView,
  SceneId,
  SunEarthSettings,
  SunEarthView,
} from '../types/dashboard'

export type UeMessage =
  | { type: 'SET_MAIN_SCENE'; scene: SceneId }
  | { type: 'SET_RADAR_VIEW'; view: RadarView }
  | { type: 'SET_SUN_EARTH_VIEW'; view: SunEarthView }
  | { type: 'SYNC_SUN_EARTH_SETTINGS'; payload: SunEarthSettings }
  | { type: 'SET_MAGNETIC_VIEW'; view: MagneticView }
  | { type: 'SYNC_MAGNETIC_SETTINGS'; payload: MagneticSettings }
  | { type: 'SYNC_DEVICE_STATE'; payload: DeviceControls }
  | { type: 'SWAP_SCENE'; main: SceneId; thumbnails: SceneId[] }

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
