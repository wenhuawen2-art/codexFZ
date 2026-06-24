import dayjs from 'dayjs'
import {
  createInitialRealtime,
  generateDarkNoise,
  generateHistoryData,
  perturbRealtime,
} from '../mocks/dashboard'
import type {
  ControlCommand,
  DashboardState,
  DeviceControls,
  HistoryPoint,
  HistoryQuery,
  OperationLog,
  RealtimeData,
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

export async function executeControl(
  cmd: ControlCommand,
  state: DashboardState,
): Promise<{ controls: DeviceControls; log: OperationLog }> {
  await new Promise((r) => setTimeout(r, 200))
  const controls = structuredClone(state.realtime.controls)
  const log: OperationLog = {
    id: crypto.randomUUID(),
    timestamp: dayjs().toISOString(),
    user: 'operator',
    deviceName: cmd.deviceName,
    eventType: 'control',
    content: `${cmd.field} → ${cmd.value}`,
    oldValue: cmd.field,
    newValue: cmd.value,
    result: 'success',
  }

  if (cmd.deviceName.startsWith('激光器')) {
    const id = parseInt(cmd.deviceName.replace(/\D/g, ''), 10)
    const laser = controls.lasers.find((l) => l.id === id)
    if (
      laser &&
      (cmd.field === 'amplifier' || cmd.field === 'oscillator' || cmd.field === 'qSwitch')
    ) {
      laser[cmd.field] = cmd.value as typeof laser.amplifier
    }
  } else if (cmd.deviceName === '种子激光器') {
    controls.seedLaser = cmd.value as typeof controls.seedLaser
  } else if (cmd.deviceName.startsWith('望远镜')) {
    const id = parseInt(cmd.deviceName.replace(/\D/g, ''), 10)
    const tel = controls.telescopes.find((t) => t.id === id)
    if (tel) tel.mode = cmd.value as typeof tel.mode
  } else if (cmd.deviceName === '超导探测器') {
    controls.snspd = cmd.value as typeof controls.snspd
  } else if (cmd.deviceName === 'TCSPC') {
    controls.tcspc = cmd.value as typeof controls.tcspc
  } else if (cmd.deviceName === '数据采集') {
    controls.acquisition = cmd.value as typeof controls.acquisition
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
