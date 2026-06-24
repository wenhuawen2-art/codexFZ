import HudBadge from '../hud/HudBadge'
import HudDataRow from '../hud/HudDataRow'
import type { SpaceEnvData } from '../../types/dashboard'

interface Scene2SpacePanelProps {
  data: SpaceEnvData
}

function Scene2SpacePanel({ data }: Scene2SpacePanelProps) {
  return (
    <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(280px,40%)] -translate-x-1/2 -translate-y-1/2 hud-glass-panel p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-2xs font-bold uppercase tracking-widest text-hud-viewport">
          空间环境预报
        </p>
        <HudBadge label="模拟数据" variant="simulated" />
      </div>
      <HudDataRow
        label="当前地磁 Kp"
        value={String(data.kpIndex)}
        valueClassName="text-hud-highlight font-bold"
      />
      <HudDataRow
        label="24h Kp 峰值"
        value={String(data.kpPeak24h)}
        valueClassName="text-hud-highlight font-bold"
      />
      <HudDataRow
        label="太阳 F10.7"
        value={`${data.f107Index} sfu`}
        valueClassName="text-hud-highlight font-bold"
      />
      <HudDataRow
        label="磁暴概率 24h"
        value={`${data.stormProb24h}%`}
        valueClassName="text-hud-highlight"
      />
      <HudDataRow label="磁暴概率 48h" value={`${data.stormProb48h}%`} />
      <HudDataRow label="磁暴概率 72h" value={`${data.stormProb72h}%`} />
      <p className="mt-2 border-t border-hud-border/20 pt-2 text-2xs text-hud-muted">
        来源：{data.source}
      </p>
    </div>
  )
}

export default Scene2SpacePanel
