import HudPanel from './hud/HudPanel'
import HudSubCard from './hud/HudSubCard'
import ChecklistRow from './hud/ChecklistRow'
import type { DeviceStatus } from './StatusPanel'
import type { IntensityPoint } from './RadarChart'

interface RightDashboardProps {
  status: DeviceStatus
  chartData: IntensityPoint[]
}

const SYSTEM_ITEMS = [
  'LIDAR CORE',
  'MOTOR DRIVER',
  'DATA BUS',
  'POINT FILTER',
  'SLAM ENGINE',
  'MAP CACHE',
  'UE BRIDGE',
  'TELEMETRY',
]

function RightDashboard({ status, chartData }: RightDashboardProps) {
  const latestIntensity = chartData.at(-1)?.intensity ?? 0
  const avgDistance =
    chartData.length > 0
      ? Math.round(
          chartData.reduce((sum, p) => sum + p.distance, 0) / chartData.length,
        )
      : 0

  return (
    <aside className="flex w-[226px] shrink-0 flex-col gap-3 overflow-y-auto bg-hud-bg p-3">
      <HudPanel title="SYSTEM CHECK">
        <div className="space-y-0">
          {SYSTEM_ITEMS.map((item, i) => (
            <ChecklistRow
              key={item}
              label={item}
              active={status.connected && i < 6}
              value={i === 6 ? (status.connected ? 'ON' : 'OFF') : undefined}
            />
          ))}
        </div>
      </HudPanel>

      <HudPanel title="TELEMETRY">
        <div className="space-y-1 text-2xs">
          <div className="flex justify-between border-b border-hud-border/20 py-1">
            <span className="text-hud-muted">INTENSITY</span>
            <span className="text-hud-grid-cross">{latestIntensity}%</span>
          </div>
          <div className="flex justify-between border-b border-hud-border/20 py-1">
            <span className="text-hud-muted">AVG DISTANCE</span>
            <span className="text-hud-grid-cross">{avgDistance} M</span>
          </div>
          <div className="flex justify-between border-b border-hud-border/20 py-1">
            <span className="text-hud-muted">POINT COUNT</span>
            <span className="text-hud-highlight">
              {status.pointCount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-hud-muted">SCAN MODE</span>
            <span className="text-hud-accent">360° CONT</span>
          </div>
        </div>
      </HudPanel>

      <HudPanel title="SUB SYSTEM">
        <div className="grid grid-cols-2 gap-1.5">
          {['OPTICS', 'ENCODER', 'IMU', 'GPS'].map((name) => (
            <HudSubCard key={name} className="text-center">
              <p className="text-2xs text-hud-muted">{name}</p>
              <p className="mt-0.5 text-2xs font-bold text-hud-active">OK</p>
            </HudSubCard>
          ))}
        </div>
      </HudPanel>

      <HudPanel title="ALERT LOG" className="flex-1">
        <div className="space-y-1 text-2xs">
          <p className="text-hud-active">[OK] Lidar initialized</p>
          <p className="text-hud-active">[OK] UE bridge ready</p>
          <p className="text-hud-muted">[--] Waiting for scan data</p>
          {!status.connected && (
            <p className="rounded bg-hud-tag-alert/60 px-1 text-hud-alert">
              [!] Connection timeout
            </p>
          )}
        </div>
      </HudPanel>
    </aside>
  )
}

export default RightDashboard
