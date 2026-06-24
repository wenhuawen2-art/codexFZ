const LEGEND_TEXT = '#fafafa'
const LEGEND_MUTED = '#79888d'

interface LegendSwatchProps {
  color: string
  label: string
  hidden?: boolean
  onClick?: () => void
}

const SWATCH_SIZE = 12

export function LegendSwatch({ color, label, hidden, onClick }: LegendSwatchProps) {
  const swatch = (
    <span
      className="inline-block shrink-0"
      style={{
        width: SWATCH_SIZE,
        height: SWATCH_SIZE,
        backgroundColor: hidden ? LEGEND_MUTED : color,
      }}
    />
  )

  const textStyle = {
    fontSize: 12,
    color: hidden ? LEGEND_MUTED : LEGEND_TEXT,
  }

  if (onClick) {
    return (
      <button
        type="button"
        className="flex items-center gap-1 border-0 bg-transparent p-0"
        style={{ ...textStyle, cursor: 'pointer' }}
        onClick={onClick}
      >
        {swatch}
        {label}
      </button>
    )
  }

  return (
    <span className="flex items-center gap-1" style={textStyle}>
      {swatch}
      {label}
    </span>
  )
}

export function CoolingLegendRow({
  items,
  className,
}: {
  items: { color: string; label: string }[]
  className?: string
}) {
  return (
    <ul className={`flex list-none justify-center gap-x-4 p-0 ${className ?? ''}`}>
      {items.map((item) => (
        <li key={item.label}>
          <LegendSwatch color={item.color} label={item.label} />
        </li>
      ))}
    </ul>
  )
}

export function DarkNoiseLegendRows({
  channels,
  colors,
  hiddenChannels,
  onToggle,
  className,
}: {
  channels: readonly number[]
  colors: readonly string[]
  hiddenChannels: Record<string, boolean>
  onToggle: (key: string) => void
  className?: string
}) {
  const items = channels.map((ch, i) => ({
    key: `ch${ch}`,
    color: colors[i],
    label: `通道${ch}`,
  }))
  const rows = [items.slice(0, 3), items.slice(3, 6)]

  return (
    <div className={`flex flex-col items-center gap-0.5 ${className ?? ''}`}>
      {rows.map((row, rowIndex) => (
        <ul key={rowIndex} className="flex list-none justify-center gap-x-4 p-0">
          {row.map((item) => (
            <li key={item.key}>
              <LegendSwatch
                color={item.color}
                label={item.label}
                hidden={hiddenChannels[item.key]}
                onClick={() => onToggle(item.key)}
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}
