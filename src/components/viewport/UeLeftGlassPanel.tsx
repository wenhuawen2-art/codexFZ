import type { ReactNode } from 'react'
import { useUeLeftPanelSize } from './UeLeftPanelContext'

interface UeLeftGlassPanelProps {
  children: ReactNode
}

function UeLeftGlassPanel({ children }: UeLeftGlassPanelProps) {
  const { width, height } = useUeLeftPanelSize()

  if (width <= 0 || height <= 0) return null

  return (
    <div
      className="pointer-events-auto hud-glass-panel flex shrink-0 flex-col overflow-hidden p-2"
      style={{ width, height }}
    >
      {children}
    </div>
  )
}

export default UeLeftGlassPanel
