export const SCENE_LABELS: Record<string, string> = {
  radar: '激光雷达系统',
  sunEarth: '日地空间位型',
  magnetic: '三维地磁场',
}

export const RADAR_VIEW_LABELS: Record<string, string> = {
  top: '俯视图',
  isometric: '轴测图',
  snspd: '超导探测器',
}

export const SUN_EARTH_VIEW_LABELS: Record<string, string> = {
  schematic: '示意视图',
  interactive: '交互视图',
}

export const MAGNETIC_VIEW_LABELS: Record<string, string> = {
  field: '三维场',
  section: '剖面观察',
}

export const MAGNETIC_SECTION_DIRECTION_LABELS: Record<string, string> = {
  ns: '南北',
  ew: '东西',
  custom: '自定义',
}

export const TRI_STATE_LABELS: Record<string, string> = {
  on: '开',
  off: '关',
  disconnected: '无法连接',
}

export const SEED_LASER_LABELS: Record<string, string> = {
  off: '关',
  single: '单频',
  triple: '三频',
  disconnected: '无法连接',
}

export const TELESCOPE_MODE_LABELS: Record<string, string> = {
  disconnected: '无法连接',
  vertical: '垂直向上',
  north25: '北倾25°',
  south25: '南倾25°',
  west25: '西倾25°',
}

export const SNSPD_LABELS: Record<string, string> = {
  disconnected: '无法连接',
  off: '关',
  observe: '观测模式',
  debug: '调试模式',
}

export const ACQUISITION_LABELS: Record<string, string> = {
  off: '关',
  once: '一次观测',
  continuous: '连续观测',
}

export const SKYLIGHT_LABELS: Record<string, string> = {
  open: '开',
  closed: '关',
  fault: '故障',
  executing: '执行中',
}

export const CONNECTION_STATUS_LABELS: Record<string, string> = {
  online: '在线',
  offline: '离线',
  disconnected: '未接入',
}

export function canControl(role: string) {
  return role === 'admin' || role === 'operator'
}
