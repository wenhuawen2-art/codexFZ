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
  limit: 0.1,
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
