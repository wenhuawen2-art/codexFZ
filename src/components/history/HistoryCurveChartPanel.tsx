import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import HistoryCurveBody, { type HistoryCurveBodyProps } from './HistoryCurveBody'

export const HISTORY_CHART_PORTAL_ID = 'history-chart-portal'

type HistoryCurveChartPanelProps = Omit<
  HistoryCurveBodyProps,
  'variant' | 'className' | 'onQuery'
> & {
  open: boolean
  onClose: () => void
}

function HistoryCurveChartPanel({
  open,
  onClose,
  ...bodyProps
}: HistoryCurveChartPanelProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const portal = document.getElementById(HISTORY_CHART_PORTAL_ID)
  if (!portal) return null

  return createPortal(
    <div
      className="pointer-events-auto absolute bottom-2 left-2 z-30 hud-history-chart-panel flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="false"
      aria-labelledby="history-curve-chart-title"
    >
      <p
        id="history-curve-chart-title"
        className="sr-only"
      >
        历史曲线
      </p>
      <HistoryCurveBody
        variant="chart"
        className="min-h-0 flex-1"
        onClose={onClose}
        {...bodyProps}
      />
    </div>,
    portal,
  )
}

export default HistoryCurveChartPanel
