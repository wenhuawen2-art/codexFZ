import { useCallback } from 'react'
import { DEVICE_SECTION, laserControlName, telescopeControlName } from '../constants/deviceNames'
import { SKYLIGHT_LABELS } from '../constants/labels'
import type {
  ControlCommand,
  DeviceControls,
  AcquisitionMode,
  SeedLaserMode,
  SkylightStatus,
  SnspdMode,
  TelescopeMode,
  TriState,
} from '../types/dashboard'
import {
  formatAcquisition,
  formatSnspd,
  formatSeed,
  formatTelescope,
  formatTriState,
} from '../utils/controlLabels'

type RequestControl = (
  cmd: ControlCommand,
  oldValue: string,
  newValue: string,
  risk: string,
) => void

export function useDeviceControlHandlers(
  requestControl: RequestControl,
  controls: DeviceControls,
  skylightStatus: SkylightStatus,
) {
  const onLaserChange = useCallback(
    (id: number, field: 'amplifier' | 'oscillator' | 'qSwitch', value: TriState) => {
      const laser = controls.lasers.find((l) => l.id === id)
      if (!laser) return
      requestControl(
        { deviceName: laserControlName(id), field, value },
        formatTriState(laser[field]),
        formatTriState(value),
        '激光控制操作，请确认设备状态安全。',
      )
    },
    [controls.lasers, requestControl],
  )

  const onSeedLaserChange = useCallback(
    (value: SeedLaserMode) => {
      requestControl(
        { deviceName: DEVICE_SECTION.seedLaser, field: 'mode', value },
        formatSeed(controls.seedLaser),
        formatSeed(value),
        '种子激光器模式切换，请确认光路安全。',
      )
    },
    [controls.seedLaser, requestControl],
  )

  const onTelescopeChange = useCallback(
    (id: number, mode: TelescopeMode) => {
      const tel = controls.telescopes.find((t) => t.id === id)
      if (!tel) return
      requestControl(
        { deviceName: telescopeControlName(id), field: 'mode', value: mode },
        formatTelescope(tel.mode),
        formatTelescope(mode),
        '望远镜指向变更，请确认观测区域安全。',
      )
    },
    [controls.telescopes, requestControl],
  )

  const onSnspdChange = useCallback(
    (value: SnspdMode) => {
      requestControl(
        { deviceName: DEVICE_SECTION.snspd, field: 'mode', value },
        formatSnspd(controls.snspd),
        formatSnspd(value),
        '超导探测器模式切换，请确认制冷与光路状态。',
      )
    },
    [controls.snspd, requestControl],
  )

  const onTcspcChange = useCallback(
    (value: TriState) => {
      requestControl(
        { deviceName: DEVICE_SECTION.tcspc, field: 'mode', value },
        formatTriState(controls.tcspc),
        formatTriState(value),
        '单光子计数器开关操作，请确认计数链路状态。',
      )
    },
    [controls.tcspc, requestControl],
  )

  const onSkylightChange = useCallback(
    (target: 'open' | 'closed') => {
      const currentLabel = SKYLIGHT_LABELS[skylightStatus] ?? skylightStatus
      const newLabel = SKYLIGHT_LABELS[target]
      requestControl(
        { deviceName: DEVICE_SECTION.skylight, field: 'skylightStatus', value: target },
        currentLabel,
        newLabel,
        '天窗开关操作，请确认观测区域与设备安全。',
      )
    },
    [requestControl, skylightStatus],
  )

  const onAcquisitionChange = useCallback(
    (value: AcquisitionMode) => {
      requestControl(
        { deviceName: DEVICE_SECTION.acquisition, field: 'mode', value },
        formatAcquisition(controls.acquisition),
        formatAcquisition(value),
        '数据采集模式变更，请确认存储与观测计划。',
      )
    },
    [controls.acquisition, requestControl],
  )

  return {
    onLaserChange,
    onSeedLaserChange,
    onTelescopeChange,
    onSnspdChange,
    onTcspcChange,
    onSkylightChange,
    onAcquisitionChange,
  }
}

export type DeviceControlHandlers = ReturnType<typeof useDeviceControlHandlers>
