import { useState } from 'react'
import clsx from 'clsx'
import { ChevronDown, ChevronRight } from 'lucide-react'
import StatusTile from '../hud/StatusTile'
import type { WeatherData } from '../../types/dashboard'

interface EquipmentSiteSummaryProps {
  siteName: string
  localTime: string
  weather: WeatherData
}

const valueTone = {
  normal: 'text-hud-text',
  active: 'text-hud-highlight',
}

function CompactMetricCard({
  label,
  value,
  tone = 'normal',
  className,
}: {
  label: string
  value: string
  tone?: 'normal' | 'active'
  className?: string
}) {
  return (
    <div
      className={clsx(
        'min-w-0 border border-hud-border/50 bg-hud-card px-1 py-0.5',
        className,
      )}
    >
      <p className="text-[10px] leading-none text-hud-muted">{label}</p>
      <p
        className={clsx(
          'mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-bold tabular-nums leading-none',
          valueTone[tone],
        )}
      >
        {value}
      </p>
    </div>
  )
}

function formatWeatherSummary(weather: WeatherData): string {
  return `${weather.temperature}℃ · ${weather.humidity}% · ${weather.windDirection} ${weather.windSpeed}m/s`
}

function EquipmentSiteSummary({
  siteName,
  localTime,
  weather,
}: EquipmentSiteSummaryProps) {
  const [weatherExpanded, setWeatherExpanded] = useState(false)

  return (
    <div className="flex shrink-0 flex-col gap-1">
      <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,7fr)] gap-1">
        <CompactMetricCard label="当前地点" value={siteName} />
        <CompactMetricCard label="当地时间" value={localTime} tone="active" />
      </div>
      <div>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-1 border border-hud-border/50 bg-hud-card px-1 py-0.5 text-left hover:border-hud-secondary"
          onClick={() => setWeatherExpanded((v) => !v)}
          aria-expanded={weatherExpanded}
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] leading-none text-hud-muted">
              天气摘要
            </span>
            <span
              className={clsx(
                'mt-0.5 block truncate whitespace-nowrap text-[10px] font-bold leading-none',
                weather.error ? 'text-hud-alert' : 'text-hud-text',
              )}
            >
              {weather.error
                ? '天气数据获取失败'
                : formatWeatherSummary(weather)}
            </span>
          </span>
          {weatherExpanded ? (
            <ChevronDown
              className="h-3 w-3 shrink-0 text-hud-muted"
              aria-hidden
            />
          ) : (
            <ChevronRight
              className="h-3 w-3 shrink-0 text-hud-muted"
              aria-hidden
            />
          )}
        </button>
        {weatherExpanded && (
          <div className="mt-1">
            {weather.error ? (
              <p className="text-[10px] text-hud-alert">天气数据获取失败</p>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                <StatusTile
                  label="温度"
                  value={`${weather.temperature}℃`}
                  status="active"
                />
                <StatusTile label="湿度" value={`${weather.humidity}%`} />
                <StatusTile label="气压" value={`${weather.pressure}hPa`} />
                <StatusTile label="风向" value={weather.windDirection} />
                <StatusTile label="风速" value={`${weather.windSpeed}m/s`} />
                <StatusTile label="风力" value={`${weather.windLevel}级`} />
                <StatusTile label="云量" value={`${weather.cloudCover}%`} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EquipmentSiteSummary
