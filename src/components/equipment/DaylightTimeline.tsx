import clsx from 'clsx'
import HudButton from '../hud/HudButton'

interface DaylightTimelineProps {
  hour: number
  sunriseHour: number
  sunsetHour: number
  weatherFxEnabled: boolean
  onHourChange: (hour: number) => void
  onWeatherFxToggle: () => void
}

function formatHour(h: number) {
  return `${String(Math.floor(h)).padStart(2, '0')}:00`
}

function DaylightTimeline({
  hour,
  sunriseHour,
  sunsetHour,
  weatherFxEnabled,
  onHourChange,
  onWeatherFxToggle,
}: DaylightTimelineProps) {
  return (
    <div className="flex w-full flex-col gap-1 border-t border-hud-border/20 bg-hud-card/60 px-3 py-2 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-2xs text-hud-muted">当地时间 · 光照模拟</span>
        <span className="text-2xs text-hud-active">{formatHour(hour)}</span>
      </div>
      <div className="relative px-1">
        <input
          type="range"
          min={0}
          max={23}
          step={1}
          value={hour}
          onChange={(e) => onHourChange(Number(e.target.value))}
          className="h-1 w-full accent-hud-active"
        />
        <div className="mt-0.5 flex justify-between text-[10px] text-hud-muted">
          <span title="日出">日出 {formatHour(sunriseHour)}</span>
          <span title="日落">日落 {formatHour(sunsetHour)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <HudButton
          className={clsx('text-2xs', weatherFxEnabled && 'border-hud-active text-hud-active')}
          onClick={onWeatherFxToggle}
        >
          天气效果 {weatherFxEnabled ? '开' : '关'}
        </HudButton>
        <span className="text-[10px] text-hud-muted">拖动滑块模拟昼夜变化</span>
      </div>
    </div>
  )
}

export default DaylightTimeline
