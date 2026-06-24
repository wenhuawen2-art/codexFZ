import { useEffect, useMemo, useRef, useState } from 'react'
import RadarLeftCharts from './RadarLeftCharts'
import SnspdLeftPanel from './SnspdLeftPanel'
import { UeLeftPanelProvider } from './UeLeftPanelContext'
import {
  computeUeLeftPanelSize,
  UE_LEFT_PANEL_GAP,
  UE_LEFT_PANEL_INSET,
} from '../../constants/ueLeftPanelLayout'
import type { ConnectionStatus, RadarView, SceneChartData } from '../../types/dashboard'

interface Scene1LeftChartsProps {
  charts: SceneChartData
  photonStatus: ConnectionStatus
  heliumStatus: ConnectionStatus
  ccdStatus: ConnectionStatus
  snspdStatus: ConnectionStatus
  radarView: RadarView
  onRefreshNoise?: () => void
}

function resolvePanelCount(radarView: RadarView, snspdStatus: ConnectionStatus): number {
  if (radarView === 'snspd') {
    return snspdStatus === 'online' ? 2 : 1
  }
  return 3
}

function Scene1LeftCharts({
  charts,
  photonStatus,
  heliumStatus,
  ccdStatus,
  snspdStatus,
  radarView,
  onRefreshNoise,
}: Scene1LeftChartsProps) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [panelSize, setPanelSize] = useState({ width: 0, height: 0 })
  const panelCount = resolvePanelCount(radarView, snspdStatus)

  useEffect(() => {
    const el = measureRef.current
    if (!el) return

    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      const availableWidth = width - UE_LEFT_PANEL_INSET.left - UE_LEFT_PANEL_INSET.right
      const availableHeight = height - UE_LEFT_PANEL_INSET.top - UE_LEFT_PANEL_INSET.bottom
      setPanelSize(computeUeLeftPanelSize(availableWidth, availableHeight, panelCount, UE_LEFT_PANEL_GAP))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [panelCount])

  const stackStyle = useMemo(
    () => ({
      left: UE_LEFT_PANEL_INSET.left,
      top: UE_LEFT_PANEL_INSET.top,
      right: UE_LEFT_PANEL_INSET.right,
      bottom: UE_LEFT_PANEL_INSET.bottom,
      gap: UE_LEFT_PANEL_GAP,
    }),
    [],
  )

  return (
    <div ref={measureRef} className="pointer-events-none absolute inset-0">
      <UeLeftPanelProvider value={panelSize}>
        <div
          className="pointer-events-none absolute flex flex-col"
          style={stackStyle}
        >
          {radarView === 'snspd' ? (
            <SnspdLeftPanel
              charts={charts}
              snspdStatus={snspdStatus}
              onRefreshNoise={onRefreshNoise}
            />
          ) : (
            <RadarLeftCharts
              charts={charts}
              photonStatus={photonStatus}
              heliumStatus={heliumStatus}
              ccdStatus={ccdStatus}
            />
          )}
        </div>
      </UeLeftPanelProvider>
    </div>
  )
}

export default Scene1LeftCharts
