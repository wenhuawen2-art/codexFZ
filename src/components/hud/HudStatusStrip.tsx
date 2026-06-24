import HudBadge from './HudBadge'

interface HudStatusStripProps {
  systemStatus: string
}

function HudStatusStrip({ systemStatus }: HudStatusStripProps) {
  return (
    <div className="shrink-0 text-2xs">
      <div className="flex flex-wrap items-center justify-between gap-x-1.5 gap-y-1">
        <HudBadge label="仿真模式" variant="simulated" />
        <HudBadge label="模拟数据" variant="simulated" />
        <span className="text-hud-muted">
          系统：
          <span className="text-hud-active">{systemStatus.toUpperCase()}</span>
        </span>
      </div>
    </div>
  )
}

export default HudStatusStrip
