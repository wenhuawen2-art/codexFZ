/** 设备中文名称（UI 标题、确认弹窗、requestControl deviceName） */
export const DEVICE_SECTION = {
  laser: '激光器',
  seedLaser: '种子激光器',
  telescope: '望远镜',
  snspd: '超导探测器',
  tcspc: '单光子计数器',
  acquisition: '数据采集',
  skylight: '天窗',
  cooling: '制冷系统',
} as const

/** 现场常用缩写 / 关联设备标识 */
export const DEVICE_SHORT = {
  snspd: 'SNSPD',
  tcspc: 'TCSPC',
} as const

export function laserUnitName(id: number) {
  return `1083nm激光器 L${id}`
}

export function laserControlName(id: number) {
  return `${DEVICE_SECTION.laser}${id}`
}

export function telescopeControlName(id: number) {
  return `${DEVICE_SECTION.telescope}${id}`
}

export function telescopeGroupName(id: number) {
  return `${DEVICE_SECTION.telescope}组${id}`
}
