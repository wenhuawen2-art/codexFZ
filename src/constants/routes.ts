export const APP_PAGES = [
  { path: '/', label: '主页面' },
  { path: '/equipment-room', label: '设备间' },
  { path: '/logs', label: '日志上传' },
] as const

export type AppPagePath = (typeof APP_PAGES)[number]['path']
