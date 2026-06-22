/** HUD 配色 token，色值与 opt/colors.txt 严格一致 */
export const colors = {
  bg: '#000000',
  card: '#082537',
  list: '#26556f',

  text: '#fafafa',
  highlight: '#fbc56a',
  accent: '#e46515',
  alert: '#f42b26',
  muted: '#79888d',

  active: '#11e99d',
  secondary: '#eeae7d',

  tag: '#7c8d95',
  tagAlert: '#69262d',

  border: '#d8d8d8',
  progress: '#fb992e',
  progressTrack: '#79888d',

  viewport: '#6bd3ed',
  gridMajor: '#fafafa',
  gridMinor: '#326479',
  gridCross: '#78c4e3',
} as const

export type HudColor = (typeof colors)[keyof typeof colors]
