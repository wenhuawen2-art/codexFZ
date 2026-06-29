import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

interface HudTimeInputProps {
  value?: string
  onChange?: (time: string) => void
  date?: Date
}

export function parseTimeParts(value: string | undefined, date?: Date) {
  const parts = (value ?? '00:00').split(':')
  const hours = Math.min(23, Math.max(0, Number(parts[0]) || 0))
  const minutes = Math.min(59, Math.max(0, Number(parts[1]) || 0))
  const secondsFromValue = parts.length >= 3 ? Number(parts[2]) : NaN
  const seconds =
    Number.isFinite(secondsFromValue) && secondsFromValue >= 0 && secondsFromValue <= 59
      ? secondsFromValue
      : date instanceof Date && !Number.isNaN(date.getTime())
        ? date.getSeconds()
        : 0

  return {
    hours,
    minutes,
    seconds: Math.min(59, Math.max(0, seconds)),
  }
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function TimeColumn({
  items,
  value,
  onSelect,
}: {
  items: number[]
  value: number
  onSelect: (next: number) => void
}) {
  const listRef = useRef<HTMLUListElement>(null)
  const selectedRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const list = listRef.current
    const item = selectedRef.current
    if (!list || !item) return
    const offset = item.offsetTop - list.clientHeight / 2 + item.clientHeight / 2
    list.scrollTop = Math.max(0, offset)
  }, [value])

  return (
    <ul ref={listRef} className="hud-time-input-list react-datepicker-ignore-onclickoutside">
      {items.map((item) => (
        <li
          key={item}
          ref={item === value ? selectedRef : undefined}
          className={clsx(
            'hud-time-input-item react-datepicker-ignore-onclickoutside',
            item === value && 'is-selected',
          )}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={() => onSelect(item)}
        >
          {pad2(item)}
        </li>
      ))}
    </ul>
  )
}

function HudTimeInput({ value, onChange, date }: HudTimeInputProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const parsed = parseTimeParts(value, date)

  const emit = (hours: number, minutes: number, seconds: number) => {
    onChange?.(`${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`)
  }

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const seconds = Array.from({ length: 60 }, (_, i) => i)

  return (
    <div
      ref={rootRef}
      className="hud-time-input react-datepicker-ignore-onclickoutside"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="hud-time-input-trigger react-datepicker-ignore-onclickoutside"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={() => setOpen((prev) => !prev)}
      >
        {pad2(parsed.hours)}:{pad2(parsed.minutes)}:{pad2(parsed.seconds)}
      </button>
      {open && (
        <div
          className="hud-time-input-panel react-datepicker-ignore-onclickoutside"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <TimeColumn
            items={hours}
            value={parsed.hours}
            onSelect={(h) => emit(h, parsed.minutes, parsed.seconds)}
          />
          <span className="hud-time-input-sep">:</span>
          <TimeColumn
            items={minutes}
            value={parsed.minutes}
            onSelect={(m) => emit(parsed.hours, m, parsed.seconds)}
          />
          <span className="hud-time-input-sep">:</span>
          <TimeColumn
            items={seconds}
            value={parsed.seconds}
            onSelect={(s) => emit(parsed.hours, parsed.minutes, s)}
          />
        </div>
      )}
    </div>
  )
}

export default HudTimeInput
