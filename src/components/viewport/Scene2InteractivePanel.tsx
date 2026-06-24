import { useEffect, useState } from 'react'
import HudButton from '../hud/HudButton'
import HudDataRow from '../hud/HudDataRow'
import { formatBeijingClock, formatUtcClock } from '../../lib/time'
import type { SunEarthSettings, SunEarthSite } from '../../types/dashboard'

interface Scene2InteractivePanelProps {
  settings: SunEarthSettings
  localSunrise: string
  localSunset: string
  onChange: (patch: Partial<SunEarthSettings>) => void
}

function formatCoord(lat: number, lon: number) {
  const latHem = lat >= 0 ? 'N' : 'S'
  const lonHem = lon >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(2)}°${latHem}, ${Math.abs(lon).toFixed(2)}°${lonHem}`
}

function Scene2InteractivePanel({
  settings,
  localSunrise,
  localSunset,
  onChange,
}: Scene2InteractivePanelProps) {
  const [latInput, setLatInput] = useState('')
  const [lonInput, setLonInput] = useState('')
  const [, tick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const utc = formatUtcClock()
  const beijing = formatBeijingClock()

  const updateSite = (id: string, patch: Partial<SunEarthSite>) => {
    onChange({
      sites: settings.sites.map((site) =>
        site.id === id ? { ...site, ...patch } : site,
      ),
    })
  }

  const removeSite = (id: string) => {
    onChange({ sites: settings.sites.filter((site) => site.id !== id) })
  }

  const addCustomSite = () => {
    const lat = parseFloat(latInput)
    const lon = parseFloat(lonInput)
    if (Number.isNaN(lat) || Number.isNaN(lon)) return
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return

    const site: SunEarthSite = {
      id: `custom-${Date.now()}`,
      label: `自定义 ${formatCoord(lat, lon)}`,
      lat,
      lon,
      rayEnabled: true,
    }
    onChange({ sites: [...settings.sites, site] })
    setLatInput('')
    setLonInput('')
  }

  return (
    <div className="pointer-events-auto absolute right-[64px] top-[160px] z-20 w-[min(260px,32%)] hud-glass-panel flex max-h-[min(520px,calc(100%-200px))] flex-col overflow-hidden p-2">
      <p className="mb-2 shrink-0 text-2xs font-bold uppercase tracking-widest text-hud-viewport">
        交互控制
      </p>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        <section>
          <p className="mb-1 text-2xs text-hud-muted">时间</p>
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <span className="text-2xs text-hud-muted">
              UTC <span className="text-hud-grid-cross">{utc}</span>
            </span>
            <span className="text-2xs text-hud-muted">
              北京 <span className="text-hud-grid-cross">{beijing}</span>
            </span>
          </div>
          <label className="mb-1 flex items-center gap-1.5 text-2xs text-hud-text">
            <input
              type="checkbox"
              checked={settings.useLiveTime}
              onChange={(e) => onChange({ useLiveTime: e.target.checked })}
              className="accent-hud-viewport"
            />
            跟随真实时间
          </label>
          {!settings.useLiveTime && (
            <input
              type="datetime-local"
              value={settings.simTime}
              onChange={(e) => onChange({ simTime: e.target.value })}
              className="hud-input w-full px-1 py-0.5 text-2xs"
            />
          )}
          <div className="mt-1 space-y-0.5">
            <HudDataRow label="当地日出" value={localSunrise} />
            <HudDataRow label="当地日落" value={localSunset} />
          </div>
        </section>

        <section>
          <p className="mb-1 text-2xs text-hud-muted">站点射线</p>
          <div className="space-y-1">
            {settings.sites.map((site) => (
              <div
                key={site.id}
                className="flex items-center gap-1 border border-hud-border/20 bg-hud-card/30 px-1 py-0.5"
              >
                <input
                  type="checkbox"
                  checked={site.rayEnabled}
                  onChange={(e) => updateSite(site.id, { rayEnabled: e.target.checked })}
                  className="accent-hud-viewport"
                  aria-label={`${site.label} 射线`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-2xs text-hud-text">{site.label}</p>
                  <p className="truncate text-[10px] text-hud-muted">
                    {formatCoord(site.lat, site.lon)}
                  </p>
                </div>
                {!site.preset && (
                  <button
                    type="button"
                    className="shrink-0 text-[10px] text-hud-accent"
                    onClick={() => removeSite(site.id)}
                  >
                    删除
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <label className="flex items-center gap-1.5 text-2xs text-hud-text">
            <input
              type="checkbox"
              checked={settings.fieldLinesVisible}
              onChange={(e) => onChange({ fieldLinesVisible: e.target.checked })}
              className="accent-hud-viewport"
            />
            显示 103.7°E 磁力线
          </label>
        </section>

        <section>
          <p className="mb-1 text-2xs text-hud-muted">添加自定义站点</p>
          <div className="grid grid-cols-2 gap-1">
            <input
              type="number"
              placeholder="纬度"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              className="hud-input px-1 py-0.5 text-2xs"
              step="any"
              min={-90}
              max={90}
            />
            <input
              type="number"
              placeholder="经度"
              value={lonInput}
              onChange={(e) => setLonInput(e.target.value)}
              className="hud-input px-1 py-0.5 text-2xs"
              step="any"
              min={-180}
              max={180}
            />
          </div>
          <HudButton className="mt-1 w-full" onClick={addCustomSite}>
            添加
          </HudButton>
        </section>
      </div>
    </div>
  )
}

export default Scene2InteractivePanel
