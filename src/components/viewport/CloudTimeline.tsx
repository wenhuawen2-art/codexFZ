import { useEffect, useState } from 'react'
import HudButton from '../hud/HudButton'
import HudPanel from '../hud/HudPanel'

function CloudTimeline() {
  const [playing, setPlaying] = useState(false)
  const [frame, setFrame] = useState(0)
  const totalFrames = 12

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % totalFrames)
    }, 500)
    return () => clearInterval(id)
  }, [playing])

  const frameProgress = frame / (totalFrames - 1)

  return (
    <HudPanel title="卫星云图" titleDivider>
      <div className="relative aspect-video w-full overflow-hidden border border-dashed border-hud-viewport/60 bg-hud-card/40">
        <img
          src={`${import.meta.env.BASE_URL}images/satellite-cloud-map.png`}
          alt="东亚区域卫星云图"
          className="absolute inset-0 h-full w-full object-cover transition duration-300"
          style={{
            opacity: playing ? 1 : 0.82,
            filter: `brightness(${0.9 + frameProgress * 0.12}) contrast(1.08)`,
            transform: `scale(1.03) translateX(${(frameProgress - 0.5) * 1.5}%)`,
          }}
        />
        <div className="pointer-events-none absolute bottom-1 right-1 border border-hud-viewport/40 bg-hud-card/80 px-1 py-0.5 text-2xs text-hud-text backdrop-blur-sm">
          {playing ? `帧 ${frame + 1}/${totalFrames}` : '卫星云图'}
        </div>
        <span className="pointer-events-none absolute left-1 top-1 h-1 w-1 bg-hud-viewport" />
      </div>

      <div className="mt-1 flex items-center gap-1">
        <HudButton className="shrink-0" onClick={() => setPlaying((p) => !p)}>
          {playing ? '暂停' : '播放'}
        </HudButton>
        <div className="flex min-w-0 flex-1 gap-px">
          {Array.from({ length: totalFrames }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFrame(i)}
              className="h-2 flex-1 border-0 p-0"
              style={{
                backgroundColor: i <= frame ? `rgba(107,211,237,${0.3 + i * 0.05})` : '#26556f',
              }}
              aria-label={`云图帧 ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <p className="mt-0.5 text-2xs text-hud-tag">近1h · 每15min更新</p>
    </HudPanel>
  )
}

export default CloudTimeline
