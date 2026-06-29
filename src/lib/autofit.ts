import autofit from 'autofit.js'
import type { AutofitOption } from 'autofit.js'

/** 大屏 HUD 设计稿尺寸，与 autofit.js 默认一致 */
export const AUTOFIT_DESIGN_WIDTH = 1920
export const AUTOFIT_DESIGN_HEIGHT = 1080

export const AUTOFIT_CONFIG: AutofitOption = {
  el: '#root',
  dw: AUTOFIT_DESIGN_WIDTH,
  dh: AUTOFIT_DESIGN_HEIGHT,
  resize: true,
  transition: 0,
  // 0：任意视口偏差都缩放；默认 0.1 在宽度恰好为 dw×90%（如 1728）时不缩放，1920 布局会溢出视口
  limit: 0,
  // 与 UE 像素流/Overlay 合成时，#root 须保持 CSS 透明背景，勿在此或 index.css 中设为不透明
}

export function setupAutofit(showInitTip = import.meta.env.DEV) {
  if (autofit.isAutofitRunning) return
  autofit.init(AUTOFIT_CONFIG, showInitTip)
}

export function teardownAutofit() {
  if (!autofit.isAutofitRunning) return
  autofit.off(AUTOFIT_CONFIG.el)
}

/** 视口坐标 → #root 内设计稿坐标（fixed 在 transform 祖先内须用此转换） */
export function viewportToDesignPoint(clientX: number, clientY: number) {
  const scale = autofit.scale || 1
  const root = document.querySelector(AUTOFIT_CONFIG.el ?? '#root')
  if (!root) {
    return { x: clientX / scale, y: clientY / scale }
  }
  const rect = root.getBoundingClientRect()
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale,
  }
}

/** 元素布局尺寸 → #root 内设计稿坐标（不受 transform scale 影响） */
export function measureDesignSize(el: HTMLElement) {
  const scale = autofit.scale || 1
  const rect = el.getBoundingClientRect()
  return {
    width: el.clientWidth || rect.width / scale,
    height: el.clientHeight || rect.height / scale,
  }
}
