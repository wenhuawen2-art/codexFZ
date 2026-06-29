import dayjs from 'dayjs'
import {
  createInitialRealtime,
  generateDarkNoise,
  generateHistoryData,
  perturbRealtime,
} from '../mocks/dashboard'
import { DEVICE_SECTION } from '../constants/deviceNames'
import type {
  ControlCommand,
  ControlLogDisplay,
  DashboardState,
  DeviceControls,
  HistoryPoint,
  HistoryQuery,
  OperationLog,
  RealtimeData,
  SystemParams,
} from '../types/dashboard'

let cachedRealtime = createInitialRealtime()

export async function fetchRealtime(): Promise<RealtimeData> {
  await new Promise((r) => setTimeout(r, 100))
  cachedRealtime = perturbRealtime(cachedRealtime)
  return {
    ...cachedRealtime,
    controls: structuredClone(cachedRealtime.controls),
    sceneCharts: cachedRealtime.sceneCharts,
  }
}

const SKYLIGHT_OPEN_FAILURE_REASON = '执行超时，未收到回读状态'

function isSkylightOpenFailure(cmd: ControlCommand, state: DashboardState): boolean {
  return (
    cmd.deviceName === DEVICE_SECTION.skylight &&
    cmd.field === 'skylightStatus' &&
    cmd.value === 'open' &&
    state.realtime.params.skylightStatus === 'closed'
  )
}

export async function executeControl(
  cmd: ControlCommand,
  state: DashboardState,
  display: ControlLogDisplay,
): Promise<{ controls: DeviceControls; log: OperationLog }> {
  await new Promise((r) => setTimeout(r, 200))

  const failed = isSkylightOpenFailure(cmd, state)
  const log: OperationLog = {
    id: crypto.randomUUID(),
    timestamp: dayjs().toISOString(),
    user: 'operator',
    deviceName: cmd.deviceName,
    eventType: 'control',
    content: display.content,
    oldValue: display.oldValue,
    newValue: display.newValue,
    result: failed ? 'failure' : 'success',
    failureReason: failed ? SKYLIGHT_OPEN_FAILURE_REASON : undefined,
  }

  if (failed) {
    return { controls: structuredClone(state.realtime.controls), log }
  }

  const controls = structuredClone(state.realtime.controls)

  if (cmd.deviceName.startsWith('激光器')) {
    const id = parseInt(cmd.deviceName.replace(/\D/g, ''), 10)
    const laser = controls.lasers.find((l) => l.id === id)
    if (
      laser &&
      (cmd.field === 'amplifier' || cmd.field === 'oscillator' || cmd.field === 'qSwitch')
    ) {
      laser[cmd.field] = cmd.value as typeof laser.amplifier
    }
  } else if (cmd.deviceName === DEVICE_SECTION.seedLaser) {
    controls.seedLaser = cmd.value as typeof controls.seedLaser
  } else if (cmd.deviceName.startsWith('望远镜')) {
    const id = parseInt(cmd.deviceName.replace(/\D/g, ''), 10)
    const tel = controls.telescopes.find((t) => t.id === id)
    if (tel) tel.mode = cmd.value as typeof tel.mode
  } else if (cmd.deviceName === DEVICE_SECTION.snspd) {
    controls.snspd = cmd.value as typeof controls.snspd
  } else if (cmd.deviceName === DEVICE_SECTION.tcspc) {
    controls.tcspc = cmd.value as typeof controls.tcspc
  } else if (cmd.deviceName === DEVICE_SECTION.acquisition) {
    controls.acquisition = cmd.value as typeof controls.acquisition
  } else if (cmd.deviceName === DEVICE_SECTION.skylight && cmd.field === 'skylightStatus') {
    cachedRealtime = {
      ...cachedRealtime,
      params: {
        ...cachedRealtime.params,
        skylightStatus: cmd.value as SystemParams['skylightStatus'],
      },
    }
  }

  cachedRealtime = { ...cachedRealtime, controls }
  return { controls, log }
}

export async function fetchHistoryCurve(query: HistoryQuery): Promise<HistoryPoint[]> {
  await new Promise((r) => setTimeout(r, 300))
  return generateHistoryData(query)
}

export function patchParams(params: Partial<RealtimeData['params']>) {
  cachedRealtime = {
    ...cachedRealtime,
    params: { ...cachedRealtime.params, ...params },
  }
}

export function refreshDarkNoise(): RealtimeData['sceneCharts']['darkNoise'] {
  const darkNoise = generateDarkNoise()
  cachedRealtime = {
    ...cachedRealtime,
    sceneCharts: { ...cachedRealtime.sceneCharts, darkNoise },
  }
  return darkNoise
}
