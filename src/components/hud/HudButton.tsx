import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

interface HudButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'active' | 'danger'
}

function HudButton({ className, variant = 'default', disabled, ...props }: HudButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        'hud-btn',
        variant === 'active' && 'border-hud-active text-hud-active',
        variant === 'danger' && 'border-hud-alert text-hud-alert',
        disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
      {...props}
    />
  )
}

export default HudButton
