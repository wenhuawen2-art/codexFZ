import {
  TRI_STATE_LABELS,
  SEED_LASER_LABELS,
  TELESCOPE_MODE_LABELS,
  SNSPD_LABELS,
  ACQUISITION_LABELS,
} from '../constants/labels'
import type {
  AcquisitionMode,
  SeedLaserMode,
  SnspdMode,
  TelescopeMode,
  TriState,
} from '../types/dashboard'

export function laserFieldLabel(field: string) {
  return field === 'amplifier' ? '放大级' : field === 'oscillator' ? '振荡级' : 'Q-Switch'
}

export function controlFieldLabel(field: string) {
  if (field === 'amplifier' || field === 'oscillator' || field === 'qSwitch') {
    return laserFieldLabel(field)
  }
  if (field === 'mode') return '模式'
  return field
}

export function formatTriState(v: TriState) {
  return TRI_STATE_LABELS[v]
}

export function formatSeed(v: SeedLaserMode) {
  return SEED_LASER_LABELS[v]
}

export function formatTelescope(v: TelescopeMode) {
  return TELESCOPE_MODE_LABELS[v]
}

export function formatSnspd(v: SnspdMode) {
  return SNSPD_LABELS[v]
}

export function formatAcquisition(v: AcquisitionMode) {
  return ACQUISITION_LABELS[v]
}
