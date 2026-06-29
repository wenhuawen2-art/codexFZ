import clsx from 'clsx'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface HudInputProps extends InputHTMLAttributes<HTMLInputElement> {
  compact?: boolean
}

const HudInput = forwardRef<HTMLInputElement, HudInputProps>(function HudInput(
  { className, compact = true, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={clsx(
        'hud-input w-full bg-hud-card text-hud-text outline-none',
        compact && 'h-4 px-1 text-2xs',
        className,
      )}
      {...props}
    />
  )
})

export default HudInput
