import type { SystemParams } from '../types/dashboard'

export type ParamLogKey = keyof SystemParams | 'amplifierEnergy'

export interface ParamLogMeta {
  paramName: string
  unit: string
}

const PARAM_LOG_META: Record<ParamLogKey, ParamLogMeta> = {
  samplingTime: { paramName: '采样时间', unit: '' },
  heightResolutionKm: { paramName: '高度分辨率', unit: 'km' },
  prfHz: { paramName: '脉冲重复频率', unit: 'Hz' },
  wavelengthNm: { paramName: '激光波长', unit: 'nm' },
  rawAccumulation: { paramName: '原始积累数', unit: '' },
  accumulatedTimeSec: { paramName: '累计时间', unit: 's' },
  laserRoomTemp: { paramName: '激光室温', unit: '℃' },
  laserRoomHumidity: { paramName: '激光室湿', unit: '%' },
  telescopeRoomTemp: { paramName: '望远镜室温', unit: '℃' },
  telescopeRoomHumidity: { paramName: '望远镜室湿', unit: '%' },
  skylightStatus: { paramName: '天窗状态', unit: '' },
  amplifierEnergy: { paramName: '放大器能量', unit: 'mJ' },
}

export function getParamLogMeta(key: string): ParamLogMeta | undefined {
  return PARAM_LOG_META[key as ParamLogKey]
}

export function formatParamLogValue(key: string, value: unknown): string {
  if (value == null) return '—'
  const meta = getParamLogMeta(key)
  const str = String(value)
  if (!meta?.unit) return str
  return `${str} ${meta.unit}`
}

export function isSystemParamKey(key: string): key is keyof SystemParams {
  return key in PARAM_LOG_META && key !== 'amplifierEnergy'
}
