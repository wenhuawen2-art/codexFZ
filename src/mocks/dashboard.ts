import dayjs from 'dayjs'
import { formatBeijingTime, formatUtcTime } from '../lib/time'
import type {
  DashboardState,
  DeviceControls,
  HistoryPoint,
  HistoryQuery,
  MagneticSettings,
  RealtimeData,
  SceneChartData,
  SunEarthSettings,
} from '../types/dashboard'

function generatePhotonCount() {
  return Array.from({ length: 24 }, (_, i) => ({
    x: 24 + i * 3,
    y: Math.round(Math.random() * 5),
  }))
}

function generateHeliumDensity() {
  return Array.from({ length: 9 }, (_, i) => ({
    x: 200 + i * 100,
    y: -0.001 + Math.random() * 0.002,
    error: 0.0002 + Math.random() * 0.0003,
  }))
}

function generateCcdHeatmap(): number[][] {
  const rows = 8
  const cols = 32
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const center = Math.abs(c - cols / 2) / (cols / 2)
      const taper = 1 - center * 0.6
      return Math.round(2055 + taper * (65535 - 2055) * (1 - r / rows))
    }),
  )
}

export function generateDarkNoise() {
  return Array.from({ length: 6 }, (_, ch) => ({
    channel: ch + 1,
    values: Array.from({ length: 40 }, () => Math.random() * 0.5),
  }))
}

export function generateSnspdCoolingCurves(): SceneChartData['snspdCoolingCurves'] {
  const sampleCount = 20
  return [1, 2, 3].map((coolerId) => {
    const maxHours = 110 + Math.random() * 20
    const points = Array.from({ length: sampleCount }, (_, i) => {
      const hours = (i / (sampleCount - 1)) * maxHours
      const tempK = 2 + 298 * Math.exp(-hours / 35) + (Math.random() - 0.5) * 0.8
      return { hours: +hours.toFixed(1), tempK: +tempK.toFixed(2) }
    })
    return { coolerId, points }
  })
}

export function createSceneCharts(): SceneChartData {
  return {
    photonCount: generatePhotonCount(),
    heliumDensity: generateHeliumDensity(),
    ccdHeatmap: generateCcdHeatmap(),
    darkNoise: generateDarkNoise(),
    snspdCoolingCurves: generateSnspdCoolingCurves(),
  }
}

export const INITIAL_CONTROLS: DeviceControls = {
  lasers: [
    { id: 1, amplifier: 'on', oscillator: 'on', qSwitch: 'off' },
    { id: 2, amplifier: 'on', oscillator: 'off', qSwitch: 'off' },
    { id: 3, amplifier: 'off', oscillator: 'off', qSwitch: 'disconnected' },
    { id: 4, amplifier: 'off', oscillator: 'off', qSwitch: 'off' },
    { id: 5, amplifier: 'off', oscillator: 'disconnected', qSwitch: 'off' },
  ],
  seedLaser: 'single',
  telescopes: [
    { id: 1, mode: 'vertical' },
    { id: 2, mode: 'north25' },
    { id: 3, mode: 'south25' },
  ],
  snspd: 'observe',
  tcspc: 'on',
  acquisition: 'continuous',
}

export const INITIAL_SUN_EARTH_SETTINGS: SunEarthSettings = {
  simTime: dayjs().format('YYYY-MM-DDTHH:mm'),
  useLiveTime: true,
  fieldLinesVisible: true,
  sites: [
    {
      id: 'site-kunming',
      label: '昆明站',
      lat: 25.6,
      lon: 103.7,
      rayEnabled: true,
      preset: true,
    },
    {
      id: 'site-hainan',
      label: '海南站',
      lat: 19.52,
      lon: 109.58,
      rayEnabled: true,
      preset: true,
    },
    {
      id: 'site-brazil',
      label: '巴西站',
      lat: -23.1794,
      lon: -45.8869,
      rayEnabled: false,
      preset: true,
    },
  ],
}

export const INITIAL_MAGNETIC_SETTINGS: MagneticSettings = {
  lineDensity: 5,
  displayRange: 3,
  sectionEnabled: false,
  sectionDirection: 'ns',
  sectionAngleDeg: 0,
}

export function createInitialRealtime(): RealtimeData {
  const now = dayjs()
  return {
    isSimulated: true,
    systemStatus: 'running',
    utcTime: formatUtcTime(now.toDate()),
    beijingTime: formatBeijingTime(now.toDate()),
    localSunrise: '06:42',
    localSunset: '19:28',
    weather: {
      temperature: 18.6,
      humidity: 62,
      pressure: 1013.2,
      windDirection: 'NE',
      windSpeed: 2.4,
      windLevel: 2,
      cloudCover: 35,
      lastUpdated: now.toISOString(),
    },
    params: {
      samplingTime: now.format('YYYY-MM-DD HH:mm:ss'),
      prfHz: 20,
      wavelengthNm: 1083.02,
      rawAccumulation: 2048,
      heightResolutionKm: 0.5,
      laserRoomTemp: 22.1,
      laserRoomHumidity: 45,
      telescopeRoomTemp: 21.8,
      telescopeRoomHumidity: 48,
      accumulatedTimeSec: 360,
      skylightStatus: 'open',
    },
    controls: INITIAL_CONTROLS,
    connections: [
      {
        key: 'laser1',
        id: 'L1',
        label: '高能量脉冲激光发射系统',
        status: 'online',
        lastUpdated: now.toISOString(),
      },
      {
        key: 'laser2',
        id: 'L2',
        label: '高能量脉冲激光发射系统',
        status: 'online',
        lastUpdated: now.toISOString(),
      },
      {
        key: 'laser3',
        id: 'L3',
        label: '高能量脉冲激光发射系统',
        status: 'offline',
        lastUpdated: now.toISOString(),
      },
      {
        key: 'laser4',
        id: 'L4',
        label: '高能量脉冲激光发射系统',
        status: 'online',
        lastUpdated: now.toISOString(),
      },
      {
        key: 'laser5',
        id: 'L5',
        label: '高能量脉冲激光发射系统',
        status: 'disconnected',
      },
      {
        key: 'tel1',
        id: 'T1',
        label: '收发光学望远镜阵列（组1）',
        status: 'online',
        lastUpdated: now.toISOString(),
      },
      {
        key: 'tel2',
        id: 'T2',
        label: '收发光学望远镜阵列（组2）',
        status: 'online',
        lastUpdated: now.toISOString(),
      },
      {
        key: 'tel3',
        id: 'T3',
        label: '收发光学望远镜阵列（组3）',
        status: 'offline',
        lastUpdated: now.toISOString(),
      },
      {
        key: 'ccd',
        id: 'C1',
        label: 'CCD光学成像系统',
        status: 'online',
        lastUpdated: now.toISOString(),
      },
      {
        key: 'snspd',
        id: 'S1',
        label: '超导纳米线单光子探测器',
        status: 'online',
        lastUpdated: now.toISOString(),
      },
    ],
    spaceEnv: {
      kpIndex: 3,
      kpPeak24h: 3,
      f107Index: 139,
      stormProb24h: 1,
      stormProb48h: 1,
      stormProb72h: 1,
      source: '空间环境预报中心',
    },
    sceneCharts: createSceneCharts(),
  }
}

export function perturbRealtime(base: RealtimeData): RealtimeData {
  const now = dayjs()
  return {
    ...base,
    utcTime: formatUtcTime(now.toDate()),
    beijingTime: formatBeijingTime(now.toDate()),
    params: {
      ...base.params,
      wavelengthNm: +(
        base.params.wavelengthNm +
        (Math.random() - 0.5) * 0.01
      ).toFixed(3),
      rawAccumulation:
        base.params.rawAccumulation + Math.round(Math.random() * 10 - 5),
      accumulatedTimeSec: base.params.accumulatedTimeSec + 1,
    },
  }
}

export function createInitialState(): DashboardState {
  return {
    realtime: createInitialRealtime(),
    mainScene: 'radar',
    thumbnailScenes: ['sunEarth', 'magnetic'],
    radarView: 'top',
    sunEarthView: 'schematic',
    sunEarthSettings: INITIAL_SUN_EARTH_SETTINGS,
    magneticView: 'field',
    magneticSettings: INITIAL_MAGNETIC_SETTINGS,
    operationLogs: [],
    pendingControl: null,
    userRole: 'operator',
  }
}

/** 每次查询模拟「某参数无数据」的概率（用于历史曲线状态图标调试） */
const HISTORY_MOCK_EMPTY_PARAM_CHANCE = 0.4

function pickMockEmptyParam(params: string[]): string | null {
  if (params.length === 0) return null
  if (Math.random() >= HISTORY_MOCK_EMPTY_PARAM_CHANCE) return null
  return params[Math.floor(Math.random() * params.length)] ?? null
}

export function generateHistoryData(query: HistoryQuery): HistoryPoint[] {
  const start = dayjs(query.start)
  const end = dayjs(query.end)
  const points: HistoryPoint[] = []
  const emptyParam = pickMockEmptyParam(query.params)
  const skylightStates: HistoryPoint['skylightStatus'][] = [
    'open',
    'closed',
    'executing',
    'fault',
  ]
  let t = start
  while (t.isBefore(end)) {
    const point: HistoryPoint = { time: t.format('HH:mm:ss') }
    if (query.params.includes('wavelengthNm') && emptyParam !== 'wavelengthNm') {
      point.wavelengthNm = 1083 + Math.random() * 0.1
    }
    if (query.params.includes('heightResolutionM') && emptyParam !== 'heightResolutionM') {
      point.heightResolutionM = 500 + Math.random() * 50
    }
    if (query.params.includes('prfHz') && emptyParam !== 'prfHz') {
      point.prfHz = 20
    }
    if (query.params.includes('rawAccumulation') && emptyParam !== 'rawAccumulation') {
      point.rawAccumulation = 2048 + Math.round(Math.random() * 20 - 10)
    }
    if (query.params.includes('accumulatedTimeSec') && emptyParam !== 'accumulatedTimeSec') {
      point.accumulatedTimeSec = t.diff(start, 'second')
    }
    if (query.params.includes('skylightStatus') && emptyParam !== 'skylightStatus') {
      point.skylightStatus =
        skylightStates[Math.floor(Math.random() * skylightStates.length)]
    }
    points.push(point)
    t = t.add(5, 'minute')
  }
  return points
}
