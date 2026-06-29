export type SceneId = 'radar' | 'sunEarth' | 'magnetic'
export type RadarView = 'top' | 'isometric' | 'snspd'
export type SunEarthView = 'schematic' | 'interactive'
export type MagneticView = 'field' | 'section'
export type MagneticSectionDirection = 'ns' | 'ew' | 'custom'
export type TriState = 'on' | 'off' | 'disconnected'
export type SeedLaserMode = 'off' | 'single' | 'triple' | 'disconnected'
export type TelescopeMode =
  | 'disconnected'
  | 'vertical'
  | 'north25'
  | 'south25'
  | 'west25'
export type SnspdMode = 'disconnected' | 'off' | 'observe' | 'debug'
export type AcquisitionMode = 'off' | 'once' | 'continuous'
export type SkylightStatus = 'open' | 'closed' | 'fault' | 'executing'
export type ConnectionStatus = 'online' | 'offline' | 'disconnected'
export type UserRole = 'admin' | 'operator' | 'viewer' | 'display'

export interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  windDirection: string
  windSpeed: number
  windLevel: number
  cloudCover: number
  lastUpdated: string
  error?: string
}

export interface SystemParams {
  samplingTime: string
  prfHz: number
  wavelengthNm: number
  rawAccumulation: number
  heightResolutionKm: number
  laserRoomTemp: number
  laserRoomHumidity: number
  telescopeRoomTemp: number
  telescopeRoomHumidity: number
  accumulatedTimeSec: number
  skylightStatus: SkylightStatus
}

export interface LaserUnit {
  id: number
  amplifier: TriState
  oscillator: TriState
  qSwitch: TriState
}

export interface TelescopeGroup {
  id: number
  mode: TelescopeMode
}

export interface DeviceControls {
  lasers: LaserUnit[]
  seedLaser: SeedLaserMode
  telescopes: TelescopeGroup[]
  snspd: SnspdMode
  tcspc: TriState
  acquisition: AcquisitionMode
}

export interface DataConnectionItem {
  key: string
  id: string
  label: string
  status: ConnectionStatus
  lastUpdated?: string
}

export interface SpaceEnvData {
  kpIndex: number
  kpPeak24h: number
  f107Index: number
  stormProb24h: number
  stormProb48h: number
  stormProb72h: number
  source: string
}

export interface SunEarthSite {
  id: string
  label: string
  lat: number
  lon: number
  rayEnabled: boolean
  preset?: boolean
}

export interface SunEarthSettings {
  simTime: string
  useLiveTime: boolean
  fieldLinesVisible: boolean
  sites: SunEarthSite[]
}

export interface MagneticSettings {
  lineDensity: number
  displayRange: number
  sectionEnabled: boolean
  sectionDirection: MagneticSectionDirection
  sectionAngleDeg: number
}

export interface SnspdCoolingCurve {
  coolerId: number
  points: { hours: number; tempK: number }[]
}

export interface SceneChartData {
  photonCount: { x: number; y: number }[]
  heliumDensity: { x: number; y: number; error: number }[]
  ccdHeatmap: number[][]
  darkNoise: { channel: number; values: number[] }[]
  snspdCoolingCurves: SnspdCoolingCurve[]
}

export interface RealtimeData {
  isSimulated: true
  systemStatus: 'standby' | 'running' | 'alarm' | 'offline'
  weather: WeatherData
  params: SystemParams
  controls: DeviceControls
  connections: DataConnectionItem[]
  spaceEnv: SpaceEnvData
  sceneCharts: SceneChartData
  utcTime: string
  beijingTime: string
  localSunrise: string
  localSunset: string
}

export type OperationEventType = 'power' | 'param' | 'control' | 'user'

export interface OperationLog {
  id: string
  timestamp: string
  user: string
  deviceName: string
  eventType: OperationEventType
  content: string
  oldValue: string
  newValue: string
  result: 'success' | 'failure'
  paramName?: string
  unit?: string
  failureReason?: string
  clientIp?: string
  terminal?: string
}

export interface HistoryPoint {
  time: string
  wavelengthNm?: number
  heightResolutionM?: number
  prfHz?: number
  rawAccumulation?: number
  accumulatedTimeSec?: number
  skylightStatus?: SkylightStatus
}

export interface HistoryQuery {
  start: string
  end: string
  params: string[]
}

export interface PendingControl {
  deviceName: string
  field: string
  oldValue: string
  newValue: string
  risk: string
  onConfirm: () => Promise<void>
}

export interface DashboardState {
  realtime: RealtimeData
  mainScene: SceneId
  thumbnailScenes: [SceneId, SceneId]
  radarView: RadarView
  sunEarthView: SunEarthView
  sunEarthSettings: SunEarthSettings
  magneticView: MagneticView
  magneticSettings: MagneticSettings
  operationLogs: OperationLog[]
  pendingControl: PendingControl | null
  userRole: UserRole
}

export type DashboardAction =
  | { type: 'SET_REALTIME'; payload: RealtimeData }
  | { type: 'PATCH_PARAMS'; payload: Partial<SystemParams> }
  | { type: 'SET_CONTROLS'; payload: DeviceControls }
  | { type: 'SWAP_SCENE'; payload: SceneId }
  | { type: 'SET_RADAR_VIEW'; payload: RadarView }
  | { type: 'SET_SUN_EARTH_VIEW'; payload: SunEarthView }
  | { type: 'PATCH_SUN_EARTH_SETTINGS'; payload: Partial<SunEarthSettings> }
  | { type: 'SET_MAGNETIC_VIEW'; payload: MagneticView }
  | { type: 'PATCH_MAGNETIC_SETTINGS'; payload: Partial<MagneticSettings> }
  | { type: 'ADD_LOG'; payload: OperationLog }
  | { type: 'SET_PENDING_CONTROL'; payload: PendingControl | null }
  | { type: 'REFRESH_DARK_NOISE'; payload: SceneChartData['darkNoise'] }

export interface ControlCommand {
  deviceName: string
  field: string
  value: string
}

export interface ControlLogDisplay {
  oldValue: string
  newValue: string
  content: string
}
