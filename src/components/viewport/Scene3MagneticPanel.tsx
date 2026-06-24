import clsx from 'clsx'
import { MAGNETIC_SECTION_DIRECTION_LABELS } from '../../constants/labels'
import HudDataRow from '../hud/HudDataRow'
import type { MagneticSectionDirection, MagneticSettings } from '../../types/dashboard'

interface Scene3MagneticPanelProps {
  settings: MagneticSettings
  sectionMode: boolean
  onChange: (patch: Partial<MagneticSettings>) => void
}

const LEGEND_STOPS = [
  { color: '#1a3a5c', label: '弱' },
  { color: '#2a7ab8', label: '' },
  { color: '#6bd3ed', label: '中' },
  { color: '#11e99d', label: '' },
  { color: '#f5d547', label: '强' },
]

const directions: MagneticSectionDirection[] = ['ns', 'ew', 'custom']

function Scene3MagneticPanel({ settings, sectionMode, onChange }: Scene3MagneticPanelProps) {
  return (
    <div className="pointer-events-auto absolute right-[64px] top-[160px] z-20 w-[min(260px,32%)] hud-glass-panel p-2">
      <p className="mb-2 text-2xs font-bold uppercase tracking-widest text-hud-viewport">
        地磁场控制
      </p>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 flex items-center justify-between text-2xs text-hud-muted">
            <span>线密度</span>
            <span className="text-hud-grid-cross">{settings.lineDensity}</span>
          </span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={settings.lineDensity}
            onChange={(e) => onChange({ lineDensity: Number(e.target.value) })}
            className="h-1 w-full accent-hud-viewport"
          />
        </label>

        <label className="block">
          <span className="mb-1 flex items-center justify-between text-2xs text-hud-muted">
            <span>显示范围</span>
            <span className="text-hud-grid-cross">{settings.displayRange}×R</span>
          </span>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={settings.displayRange}
            onChange={(e) => onChange({ displayRange: Number(e.target.value) })}
            className="h-1 w-full accent-hud-viewport"
          />
        </label>

        {sectionMode && (
          <section className="space-y-2 border-t border-hud-border/20 pt-2">
            <p className="text-2xs text-hud-muted">剖面方向</p>
            <div className="flex flex-wrap gap-0.5">
              {directions.map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => onChange({ sectionDirection: dir })}
                  className={clsx(
                    'hud-pill min-w-0 flex-1 truncate px-0.5',
                    settings.sectionDirection === dir && 'hud-pill-selected',
                  )}
                >
                  {MAGNETIC_SECTION_DIRECTION_LABELS[dir]}
                </button>
              ))}
            </div>
            {settings.sectionDirection === 'custom' && (
              <label className="block">
                <span className="mb-1 flex items-center justify-between text-2xs text-hud-muted">
                  <span>剖面角度</span>
                  <span className="text-hud-grid-cross">{settings.sectionAngleDeg}°</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={359}
                  step={1}
                  value={settings.sectionAngleDeg}
                  onChange={(e) => onChange({ sectionAngleDeg: Number(e.target.value) })}
                  className="h-1 w-full accent-hud-viewport"
                />
              </label>
            )}
            <HudDataRow
              label="剖面模式"
              value={settings.sectionEnabled ? '已启用' : '未启用'}
              valueClassName="text-hud-active"
            />
          </section>
        )}

        <section className="border-t border-hud-border/20 pt-2">
          <p className="mb-1 text-2xs text-hud-muted">磁场强度图例</p>
          <div className="flex h-3 overflow-hidden rounded-sm border border-hud-border/30">
            {LEGEND_STOPS.map((stop, i) => (
              <div
                key={i}
                className="min-w-0 flex-1"
                style={{ backgroundColor: stop.color }}
                title={stop.label || undefined}
              />
            ))}
          </div>
          <div className="mt-0.5 flex justify-between text-[10px] text-hud-muted">
            <span>弱</span>
            <span>中</span>
            <span>强</span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Scene3MagneticPanel
