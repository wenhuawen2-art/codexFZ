/** UE 视口左侧图表面板：相对 UE 内容区（inset 10px 内）左上角的自适应布局 */

/** 设计参考尺寸 320×240，用于宽高比 */
export const UE_LEFT_PANEL_ASPECT = 320 / 240

export const UE_LEFT_PANEL_INSET = { top: 70, right: 70, bottom: 70, left: 70 } as const

export const UE_LEFT_PANEL_GAP = 16

/** @deprecated 使用 UE_LEFT_PANEL_INSET */
export const UE_LEFT_PANEL_OFFSET = { x: UE_LEFT_PANEL_INSET.left, y: UE_LEFT_PANEL_INSET.top } as const

export function computeUeLeftPanelSize(
  availableWidth: number,
  availableHeight: number,
  panelCount: number,
  gap: number = UE_LEFT_PANEL_GAP,
): { width: number; height: number } {
  if (panelCount <= 0 || availableWidth <= 0 || availableHeight <= 0) {
    return { width: 0, height: 0 }
  }

  const totalGap = gap * Math.max(0, panelCount - 1)
  let height = (availableHeight - totalGap) / panelCount
  let width = height * UE_LEFT_PANEL_ASPECT

  if (width > availableWidth) {
    width = availableWidth
    height = width / UE_LEFT_PANEL_ASPECT
  }

  const totalHeight = height * panelCount + totalGap
  if (totalHeight > availableHeight) {
    height = (availableHeight - totalGap) / panelCount
    width = height * UE_LEFT_PANEL_ASPECT
    if (width > availableWidth) {
      width = availableWidth
      height = width / UE_LEFT_PANEL_ASPECT
    }
  }

  let finalWidth = Math.max(0, Math.floor(width))
  let finalHeight = Math.max(0, Math.floor(height))

  // floor 可能导致总高度略超 availableHeight，再 clamp 一次
  const flooredTotal = finalHeight * panelCount + totalGap
  if (flooredTotal > availableHeight && panelCount > 0) {
    finalHeight = Math.max(0, Math.floor((availableHeight - totalGap) / panelCount))
    finalWidth = Math.max(0, Math.floor(finalHeight * UE_LEFT_PANEL_ASPECT))
    if (finalWidth > availableWidth) {
      finalWidth = Math.max(0, Math.floor(availableWidth))
      finalHeight = Math.max(0, Math.floor(finalWidth / UE_LEFT_PANEL_ASPECT))
    }
  }

  return {
    width: finalWidth,
    height: finalHeight,
  }
}
