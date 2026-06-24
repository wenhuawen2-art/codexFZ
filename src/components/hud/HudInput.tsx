import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'

interface HudInputProps extends InputHTMLAttributes<HTMLInputElement> {
  compact?: boolean
}

function HudInput({ className, compact = true, ...props }: HudInputProps) {
  return (
    <input
      className={clsx(
        'hud-input w-full bg-hud-card text-hud-text outline-none',
        compact && 'h-4 px-1 text-2xs',
        className,
      )}
      {...props}
    />
  )
}

export default HudInput
