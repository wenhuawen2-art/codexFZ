import type { EquipmentLayerKey, EquipmentObjectMeta } from '../constants/equipmentRoom'
import { SKYLIGHT_LABELS } from '../constants/labels'
import type { DeviceControls, LaserUnit, SkylightStatus } from '../types/dashboard'
import { formatSnspd, formatSeed, formatTelescope, formatTriState } from './controlLabels'

export type EquipmentStatusVariant = EquipmentObjectMeta['statusVariant']

export interface EquipmentNodeStatus {
  label: string
  variant: EquipmentStatusVariant
}

function isLaserRunning(laser: LaserUnit): boolean {
  return laser.amplifier === 'on' || laser.oscillator === 'on' || laser.qSwitch === 'on'
}

function isLaserDisconnected(laser: LaserUnit): boolean {
  return (
    laser.amplifier === 'disconnected' &&
    laser.oscillator === 'disconnected' &&
    laser.qSwitch === 'disconnected'
  )
}

function resolveLaserStatus(laser: LaserUnit): EquipmentNodeStatus {
  if (isLaserDisconnected(laser)) {
    return { label: '无法连接', variant: 'offline' }
  }
  if (isLaserRunning(laser)) {
    return { label: '运行中', variant: 'simulated' }
  }
  return { label: '待机', variant: 'online' }
}

function resolveLaserGroupStatus(controls: DeviceControls): EquipmentNodeStatus {
  const running = controls.lasers.filter(isLaserRunning).length
  const total = controls.lasers.length
  if (running === 0) {
    const allDisconnected = controls.lasers.every(isLaserDisconnected)
    return allDisconnected
      ? { label: '无法连接', variant: 'offline' }
      : { label: '待机', variant: 'online' }
  }
  return { label: `${running}/${total} 运行中`, variant: 'simulated' }
}

function resolveTelescopeGroupStatus(mode: DeviceControls['telescopes'][number]['mode']): EquipmentNodeStatus {
  if (mode === 'disconnected') {
    return { label: formatTelescope(mode), variant: 'offline' }
  }
  return { label: formatTelescope(mode), variant: 'online' }
}

function resolveTelescopeTypeStatus(controls: DeviceControls): EquipmentNodeStatus {
  const modes = controls.telescopes.map((t) => t.mode)
  const disconnected = modes.every((m) => m === 'disconnected')
  if (disconnected) {
    return { label: '无法连接', variant: 'offline' }
  }
  const unique = new Set(modes.filter((m) => m !== 'disconnected'))
  if (unique.size === 1) {
    const mode = [...unique][0]
    return { label: formatTelescope(mode), variant: 'online' }
  }
  const active = modes.filter((m) => m !== 'disconnected').length
  return { label: `${active}/${modes.length} 组在线`, variant: 'online' }
}

function resolveSeedLaserStatus(seedLaser: DeviceControls['seedLaser']): EquipmentNodeStatus {
  if (seedLaser === 'disconnected') {
    return { label: formatSeed(seedLaser), variant: 'offline' }
  }
  if (seedLaser === 'off') {
    return { label: formatSeed(seedLaser), variant: 'offline' }
  }
  return { label: formatSeed(seedLaser), variant: 'online' }
}

function resolveTcspcStatus(tcspc: DeviceControls['tcspc']): EquipmentNodeStatus {
  if (tcspc === 'disconnected') {
    return { label: formatTriState(tcspc), variant: 'offline' }
  }
  if (tcspc === 'on') {
    return { label: formatTriState(tcspc), variant: 'online' }
  }
  return { label: formatTriState(tcspc), variant: 'offline' }
}

function resolveSnspdStatus(snspd: DeviceControls['snspd']): EquipmentNodeStatus {
  if (snspd === 'disconnected') {
    return { label: formatSnspd(snspd), variant: 'offline' }
  }
  if (snspd === 'observe') {
    return { label: formatSnspd(snspd), variant: 'online' }
  }
  if (snspd === 'debug') {
    return { label: formatSnspd(snspd), variant: 'simulated' }
  }
  return { label: formatSnspd(snspd), variant: 'online' }
}

function resolveSkylightStatus(status: SkylightStatus): EquipmentNodeStatus {
  if (status === 'open') return { label: SKYLIGHT_LABELS.open, variant: 'online' }
  if (status === 'fault') return { label: SKYLIGHT_LABELS.fault, variant: 'alert' }
  if (status === 'executing') return { label: SKYLIGHT_LABELS.executing, variant: 'simulated' }
  return { label: SKYLIGHT_LABELS.closed, variant: 'offline' }
}

function resolveLayerStatus(visible: boolean): EquipmentNodeStatus {
  return visible
    ? { label: '可见', variant: 'online' }
    : { label: '隐藏', variant: 'offline' }
}

export function resolveEquipmentNodeStatus(
  nodeId: string,
  options: {
    controls: DeviceControls
    skylightStatus?: SkylightStatus
    layerKey?: EquipmentLayerKey
    visibleLayers?: Record<EquipmentLayerKey, boolean>
    fallback?: Pick<EquipmentObjectMeta, 'status' | 'statusVariant'>
  },
): EquipmentNodeStatus {
  const { controls, skylightStatus, layerKey, visibleLayers, fallback } = options

  if (layerKey != null && visibleLayers) {
    return resolveLayerStatus(visibleLayers[layerKey])
  }

  const laserMatch = nodeId.match(/^laser-(\d+)$/)
  if (laserMatch) {
    const laser = controls.lasers.find((l) => l.id === Number(laserMatch[1]))
    if (laser) return resolveLaserStatus(laser)
  }

  if (nodeId === 'type-laser') {
    return resolveLaserGroupStatus(controls)
  }

  const telMatch = nodeId.match(/^tel-group-(\d+)$/)
  if (telMatch) {
    const tel = controls.telescopes.find((t) => t.id === Number(telMatch[1]))
    if (tel) return resolveTelescopeGroupStatus(tel.mode)
  }

  if (nodeId === 'type-telescope') {
    return resolveTelescopeTypeStatus(controls)
  }

  if (nodeId === 'type-snspd') {
    return resolveSnspdStatus(controls.snspd)
  }

  if (nodeId === 'type-seed-laser') {
    return resolveSeedLaserStatus(controls.seedLaser)
  }

  if (nodeId === 'type-tcspc') {
    return resolveTcspcStatus(controls.tcspc)
  }

  if (nodeId === 'device-skylight' && skylightStatus) {
    return resolveSkylightStatus(skylightStatus)
  }

  if (fallback) {
    return { label: fallback.status, variant: fallback.statusVariant }
  }

  return { label: '—', variant: 'offline' }
}
